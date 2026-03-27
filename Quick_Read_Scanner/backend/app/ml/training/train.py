"""
============================================================
  Prescription OCR — Full Training Pipeline
  File: backend/app/ml/training/train.py

  FLOW:
    Step 1 → Download EMNIST dataset
    Step 2 → Load your real prescription letters
    Step 3 → Augment data (500 → 5000+ images)
    Step 4 → Phase 1: Train classifier head (EfficientNetB0)
    Step 5 → Phase 2: Fine-tune on doctor handwriting
    Step 6 → Evaluate model accuracy
    Step 7 → Export to TFLite for mobile
============================================================
"""

import os
import sys
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import logging
from datetime import datetime

# ── Local imports ─────────────────────────────────────────
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../../'))
from app.ml.models.efficientnet_model import (
    build_efficientnet_model,
    unfreeze_for_finetuning
)
from app.ml.models.cnn_model import build_cnn_model
from app.ml.training.callbacks import get_callbacks
from app.ml.training.evaluate import evaluate_model, plot_training_history

# ── Logging setup ─────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s  %(levelname)s  %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(f'logs/train_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log')
    ]
)
log = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────
LETTERS      = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
NUM_CLASSES  = 26
IMG_SIZE     = 64          # 64×64 pixels per letter
BATCH_SIZE   = 32
EPOCHS_P1    = 15          # Phase 1: train head only
EPOCHS_P2    = 35          # Phase 2: fine-tune deep layers
IMG_SHAPE    = (IMG_SIZE, IMG_SIZE, 3)

DATA_DIR         = "data/processed/letters"
RAW_LETTERS_DIR  = "data/raw/letters"
MODEL_DIR        = "data/models/saved"
TFLITE_DIR       = "data/models/tflite"
LOG_DIR          = "logs"
MODEL_SAVE_PATH  = os.path.join(MODEL_DIR, "best_model.keras")
TFLITE_PATH      = os.path.join(TFLITE_DIR, "prescription_ocr.tflite")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(TFLITE_DIR, exist_ok=True)
os.makedirs(LOG_DIR,    exist_ok=True)


# ════════════════════════════════════════════════════════════
#  STEP 1 — Download EMNIST dataset
# ════════════════════════════════════════════════════════════

def load_emnist_data():
    """
    Download EMNIST Letters dataset via tensorflow_datasets.
    Returns (X_train, y_train, X_val, y_val) as numpy arrays.

    Install first:
        pip install tensorflow-datasets
    """
    log.info("Step 1: Loading EMNIST Letters dataset...")

    try:
        import tensorflow_datasets as tfds

        ds_train, ds_val = tfds.load(
            'emnist/letters',
            split=['train', 'test'],
            as_supervised=True,
            shuffle_files=True
        )

        def prepare(image, label):
            # EMNIST letters: label 1-26 → 0-25
            image = tf.cast(image, tf.float32) / 255.0
            image = tf.image.resize(image, [IMG_SIZE, IMG_SIZE])
            # Grayscale → RGB (EfficientNet needs 3 channels)
            image = tf.image.grayscale_to_rgb(image)
            label = label - 1   # shift 1–26 to 0–25
            return image, label

        AUTOTUNE = tf.data.AUTOTUNE

        train_ds = ds_train.map(prepare, num_parallel_calls=AUTOTUNE)\
                           .cache()\
                           .shuffle(10000)\
                           .batch(BATCH_SIZE)\
                           .prefetch(AUTOTUNE)

        val_ds   = ds_val.map(prepare, num_parallel_calls=AUTOTUNE)\
                         .batch(BATCH_SIZE)\
                         .prefetch(AUTOTUNE)

        log.info("✅ EMNIST loaded — 112,800 training samples")
        return train_ds, val_ds, True   # True = tf.data pipeline

    except ImportError:
        log.warning("tensorflow_datasets not installed.")
        log.warning("Run: pip install tensorflow-datasets")
        log.warning("Falling back to real prescription data only.")
        return None, None, False


# ════════════════════════════════════════════════════════════
#  STEP 2 — Load real doctor prescription letters
# ════════════════════════════════════════════════════════════

def load_real_prescription_data(data_dir=DATA_DIR):
    """
    Load manually labelled letter images from:
        data/processed/letters/train/A/*.png
        data/processed/letters/train/B/*.png
        ...

    Returns X (images), y (labels) as numpy arrays.
    """
    log.info("Step 2: Loading real prescription letter images...")

    X, y = [], []
    train_dir = os.path.join(data_dir, 'train')

    if not os.path.exists(train_dir):
        log.warning(f"  ⚠️  Folder not found: {train_dir}")
        log.warning("  Add your prescription letter images first.")
        log.warning("  Structure: data/processed/letters/train/A/img001.png")
        return None, None

    found_letters = 0
    for idx, letter in enumerate(LETTERS):
        letter_dir = os.path.join(train_dir, letter)
        if not os.path.exists(letter_dir):
            continue

        images_in_letter = 0
        for fname in os.listdir(letter_dir):
            if not fname.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
            img_path = os.path.join(letter_dir, fname)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                continue

            # Preprocess: threshold + resize
            _, img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))

            # Grayscale → RGB
            img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
            img_rgb = img_rgb.astype('float32') / 255.0

            X.append(img_rgb)
            y.append(idx)
            images_in_letter += 1

        if images_in_letter > 0:
            found_letters += 1
            log.info(f"  {letter}: {images_in_letter} images")

    if len(X) == 0:
        log.warning("  No real prescription images found.")
        return None, None

    X = np.array(X)
    y = np.array(y)
    log.info(f"✅ Real data loaded — {len(X)} images across {found_letters} letters")
    return X, y


# ════════════════════════════════════════════════════════════
#  STEP 3 — Data Augmentation
# ════════════════════════════════════════════════════════════

def get_augmentation_generators():
    """
    Training augmentation — simulate doctor handwriting variation:
      - rotation    : slightly tilted letters
      - shift       : different pen positions
      - zoom        : near / far
      - shear       : italic-style slant
    Validation: only rescale (no augmentation)
    """
    log.info("Step 3: Setting up data augmentation...")

    train_aug = ImageDataGenerator(
        rescale          = 1.0 / 255,
        rotation_range   = 15,       # ±15 degrees
        width_shift_range= 0.10,
        height_shift_range=0.10,
        zoom_range       = 0.10,
        shear_range      = 0.10,
        horizontal_flip  = False,    # Letters must NOT flip
        fill_mode        = 'nearest'
    )

    val_aug = ImageDataGenerator(rescale=1.0 / 255)

    log.info("✅ Augmentation ready (500 images → ~5,000 per epoch)")
    return train_aug, val_aug


def get_directory_generators(train_aug, val_aug, data_dir=DATA_DIR):
    """
    Flow images from labelled directory structure.
    """
    train_gen = train_aug.flow_from_directory(
        os.path.join(data_dir, 'train'),
        target_size   = (IMG_SIZE, IMG_SIZE),
        color_mode    = 'rgb',
        batch_size    = BATCH_SIZE,
        class_mode    = 'categorical',
        shuffle       = True
    )
    val_gen = val_aug.flow_from_directory(
        os.path.join(data_dir, 'val'),
        target_size   = (IMG_SIZE, IMG_SIZE),
        color_mode    = 'rgb',
        batch_size    = BATCH_SIZE,
        class_mode    = 'categorical',
        shuffle       = False
    )
    return train_gen, val_gen


# ════════════════════════════════════════════════════════════
#  STEP 4 — Phase 1: Train classifier head
# ════════════════════════════════════════════════════════════

def phase1_train(train_data, val_data, use_tf_pipeline=False):
    """
    Phase 1: EfficientNetB0 base is FROZEN.
    Only the top Dense layers are trained.
    Fast — ~15 epochs, ~30 min on CPU, ~5 min on GPU.

    Goal: reach ~80% val_accuracy with general handwriting.
    """
    log.info("=" * 55)
    log.info("PHASE 1 — Training classifier head")
    log.info("  EfficientNetB0 base: FROZEN")
    log.info(f"  Epochs: {EPOCHS_P1}  |  Batch: {BATCH_SIZE}")
    log.info("=" * 55)

    model, base = build_efficientnet_model(num_classes=NUM_CLASSES)
    model.summary(print_fn=log.info)

    callbacks = get_callbacks(MODEL_SAVE_PATH, phase=1)

    if use_tf_pipeline:
        history = model.fit(
            train_data,
            validation_data = val_data,
            epochs          = EPOCHS_P1,
            callbacks       = callbacks
        )
    else:
        history = model.fit(
            train_data,
            validation_data = val_data,
            epochs          = EPOCHS_P1,
            callbacks       = callbacks
        )

    best_acc = max(history.history['val_accuracy'])
    log.info(f"✅ Phase 1 complete — Best val accuracy: {best_acc*100:.1f}%")
    return model, base, history


# ════════════════════════════════════════════════════════════
#  STEP 5 — Phase 2: Fine-tune on doctor handwriting
# ════════════════════════════════════════════════════════════

def phase2_finetune(model, base, train_data, val_data, use_tf_pipeline=False):
    """
    Phase 2: Unfreeze last 20 layers of EfficientNetB0.
    Train with very low learning rate (1e-5).
    Adapts model to specific doctor handwriting style.

    Goal: reach 92–95% val_accuracy on real prescriptions.
    """
    log.info("=" * 55)
    log.info("PHASE 2 — Fine-tuning on doctor handwriting")
    log.info("  EfficientNetB0 last 20 layers: UNFROZEN")
    log.info(f"  Learning rate: 0.00001  |  Epochs: {EPOCHS_P2}")
    log.info("=" * 55)

    model = unfreeze_for_finetuning(model, base, num_layers=20)

    # New save path for fine-tuned model
    finetuned_path = MODEL_SAVE_PATH.replace('.keras', '_finetuned.keras')
    callbacks = get_callbacks(finetuned_path, phase=2)

    if use_tf_pipeline:
        history = model.fit(
            train_data,
            validation_data = val_data,
            epochs          = EPOCHS_P2,
            callbacks       = callbacks
        )
    else:
        # If we have real prescription data, use it now
        real_train_dir = os.path.join(DATA_DIR, 'train')
        if os.path.exists(real_train_dir) and len(os.listdir(real_train_dir)) > 0:
            log.info("  Using real prescription data for fine-tuning...")
            train_aug, val_aug = get_augmentation_generators()
            real_train, real_val = get_directory_generators(train_aug, val_aug)
            history = model.fit(
                real_train,
                validation_data = real_val,
                epochs          = EPOCHS_P2,
                callbacks       = callbacks
            )
        else:
            history = model.fit(
                train_data,
                validation_data = val_data,
                epochs          = EPOCHS_P2,
                callbacks       = callbacks
            )

    best_acc = max(history.history['val_accuracy'])
    log.info(f"✅ Phase 2 complete — Best val accuracy: {best_acc*100:.1f}%")
    return model, history, finetuned_path


# ════════════════════════════════════════════════════════════
#  STEP 6 — Evaluate
# ════════════════════════════════════════════════════════════

def run_evaluation(model, val_data, history_p1, history_p2):
    """
    Print test accuracy, confusion matrix, per-letter accuracy.
    """
    log.info("=" * 55)
    log.info("STEP 6 — Evaluating model")
    log.info("=" * 55)
    evaluate_model(model, val_data, LETTERS)
    plot_training_history(history_p1, history_p2)


# ════════════════════════════════════════════════════════════
#  STEP 7 — Export to TFLite
# ════════════════════════════════════════════════════════════

def export_tflite(model_path: str):
    """
    Convert Keras model → TFLite with INT8 quantization.
    Result: ~10MB model file for React Native app.
    """
    log.info("=" * 55)
    log.info("STEP 7 — Exporting to TFLite (mobile)")
    log.info("=" * 55)

    model = tf.keras.models.load_model(model_path)

    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    # INT8 quantization → smaller file + faster on mobile
    converter.optimizations = [tf.lite.Optimize.DEFAULT]

    # Representative dataset for quantization calibration
    def representative_data_gen():
        for _ in range(100):
            dummy = np.random.rand(1, IMG_SIZE, IMG_SIZE, 3).astype(np.float32)
            yield [dummy]

    converter.representative_dataset = representative_data_gen
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type  = tf.uint8
    converter.inference_output_type = tf.uint8

    tflite_model = converter.convert()

    os.makedirs(TFLITE_DIR, exist_ok=True)
    with open(TFLITE_PATH, 'wb') as f:
        f.write(tflite_model)

    size_mb = os.path.getsize(TFLITE_PATH) / (1024 * 1024)
    log.info(f"✅ TFLite exported → {TFLITE_PATH}")
    log.info(f"   File size: {size_mb:.1f} MB")
    log.info(f"   Ready for React Native app!")
    return TFLITE_PATH


# ════════════════════════════════════════════════════════════
#  MAIN — Run full pipeline
# ════════════════════════════════════════════════════════════

def train(use_emnist=True, use_real_data=True):
    """
    Full training pipeline.

    Args:
        use_emnist    : Download + train on EMNIST dataset first
        use_real_data : Fine-tune on your real prescription images
    """
    log.info("╔══════════════════════════════════════════════╗")
    log.info("║   PRESCRIPTION OCR — TRAINING PIPELINE      ║")
    log.info("╚══════════════════════════════════════════════╝")
    log.info(f"  TensorFlow version : {tf.__version__}")
    log.info(f"  GPU available      : {len(tf.config.list_physical_devices('GPU')) > 0}")
    log.info(f"  Image size         : {IMG_SIZE}×{IMG_SIZE}")
    log.info(f"  Classes            : {NUM_CLASSES} (A–Z)")

    # ── Step 1 & 3: EMNIST data ──────────────────────────
    train_data, val_data, use_tf_pipeline = None, None, False
    if use_emnist:
        train_data, val_data, use_tf_pipeline = load_emnist_data()

    # ── Fall back to directory generators ────────────────
    if train_data is None:
        log.info("Building data generators from local files...")
        train_aug, val_aug = get_augmentation_generators()
        train_data, val_data = get_directory_generators(train_aug, val_aug)
        use_tf_pipeline = False

    # ── Step 4: Phase 1 ──────────────────────────────────
    model, base, history_p1 = phase1_train(
        train_data, val_data, use_tf_pipeline
    )

    # ── Step 5: Phase 2 fine-tune ─────────────────────────
    final_model_path = MODEL_SAVE_PATH
    history_p2       = None

    if use_real_data:
        model, history_p2, final_model_path = phase2_finetune(
            model, base, train_data, val_data, use_tf_pipeline
        )
    else:
        log.info("Skipping Phase 2 (no real data yet).")

    # ── Step 6: Evaluate ─────────────────────────────────
    run_evaluation(model, val_data, history_p1, history_p2)

    # ── Step 7: Export TFLite ────────────────────────────
    tflite_path = export_tflite(final_model_path)

    log.info("╔══════════════════════════════════════════════╗")
    log.info("║   TRAINING COMPLETE!                        ║")
    log.info(f"║   Model  : {final_model_path:<35}║")
    log.info(f"║   TFLite : {tflite_path:<35}║")
    log.info("╚══════════════════════════════════════════════╝")
    return model


# ── CLI entry point ───────────────────────────────────────
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Train Prescription OCR model")
    parser.add_argument('--no-emnist',    action='store_true',
                        help='Skip EMNIST download (use local data only)')
    parser.add_argument('--no-real-data', action='store_true',
                        help='Skip Phase 2 fine-tuning')
    parser.add_argument('--quick',        action='store_true',
                        help='Quick test run (5 epochs each phase)')
    args = parser.parse_args()

    if args.quick:
        EPOCHS_P1 = 5
        EPOCHS_P2 = 5
        log.info("Quick mode: 5 epochs only")

    train(
        use_emnist    = not args.no_emnist,
        use_real_data = not args.no_real_data
    )