"""
callbacks.py — Smart training callbacks
Controls learning rate, early stopping, checkpointing.
"""

import tensorflow as tf
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping,
    ReduceLROnPlateau, TensorBoard, CSVLogger
)
import os
import logging

log = logging.getLogger(__name__)


def get_callbacks(model_save_path: str, phase: int = 1):
    """
    Return smart callbacks for training.

    Phase 1 (EMNIST general training):
      - Higher patience — allow more exploration
    Phase 2 (Doctor handwriting fine-tune):
      - Lower patience — stop quickly if overfitting
    """
    os.makedirs(os.path.dirname(model_save_path) or '.', exist_ok=True)
    os.makedirs("logs", exist_ok=True)

    patience_stop = 12 if phase == 1 else 8
    patience_lr   =  5 if phase == 1 else 3

    callbacks = [

        # 1. Save best model (by val_accuracy)
        ModelCheckpoint(
            filepath        = model_save_path,
            monitor         = 'val_accuracy',
            save_best_only  = True,
            save_weights_only=False,
            verbose         = 1,
            mode            = 'max'
        ),

        # 2. Stop training if val_loss stops improving
        EarlyStopping(
            monitor              = 'val_loss',
            patience             = patience_stop,
            restore_best_weights = True,
            verbose              = 1,
            mode                 = 'min'
        ),

        # 3. Cut learning rate when stuck (× 0.5)
        ReduceLROnPlateau(
            monitor  = 'val_loss',
            factor   = 0.5,
            patience = patience_lr,
            min_lr   = 1e-8,
            verbose  = 1,
            mode     = 'min'
        ),

        # 4. TensorBoard — open with: tensorboard --logdir logs/
        TensorBoard(
            log_dir        = f'logs/phase{phase}',
            histogram_freq = 1,
            update_freq    = 'epoch'
        ),

        # 5. Save epoch results to CSV
        CSVLogger(
            filename = f'logs/phase{phase}_training_log.csv',
            append   = True
        ),

        # 6. Custom epoch printer
        _EpochLogger(phase=phase),
    ]

    log.info(f"  Callbacks ready (Phase {phase})")
    log.info(f"  Early stop patience : {patience_stop} epochs")
    log.info(f"  LR reduce patience  : {patience_lr} epochs")
    return callbacks


class _EpochLogger(tf.keras.callbacks.Callback):
    """Print a clean summary line after each epoch."""

    def __init__(self, phase=1):
        super().__init__()
        self.phase = phase

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        acc     = logs.get('accuracy',     0) * 100
        val_acc = logs.get('val_accuracy', 0) * 100
        loss    = logs.get('loss',     0)
        val_loss= logs.get('val_loss', 0)
        lr      = float(tf.keras.backend.get_value(self.model.optimizer.learning_rate))

        bar_train = "█" * int(acc / 5)
        bar_val   = "█" * int(val_acc / 5)

        print(
            f"\n  Phase {self.phase}  Epoch {epoch+1:03d}"
            f"  |  Train: {bar_train:<20} {acc:.1f}%"
            f"  |  Val: {bar_val:<20} {val_acc:.1f}%"
            f"  |  Loss: {val_loss:.4f}"
            f"  |  LR: {lr:.2e}"
        )

        # Warn if overfitting
        if val_acc < acc - 10:
            print("  ⚠️  Possible overfitting — val_acc much lower than train_acc")
        if val_acc >= 95:
            print("  🎯 Excellent! val_accuracy ≥ 95%")
        elif val_acc >= 85:
            print("  ✅ Good — val_accuracy ≥ 85%")