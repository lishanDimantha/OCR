import tensorflow as tf
from tensorflow.keras import layers, models, Model
from tensorflow.keras.applications import EfficientNetB0

def build_efficientnet_model(num_classes=26):
    """
    Transfer learning with EfficientNetB0.
    Best accuracy for fine-tuning on real doctor prescriptions.
    """
    base = EfficientNetB0(
        weights='imagenet',
        include_top=False,
        input_shape=(64, 64, 3)
    )
    base.trainable = False  # Freeze phase 1

    x = base.output
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.4)(x)
    output = layers.Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base.input, outputs=output)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model, base

def unfreeze_for_finetuning(model, base, num_layers=20):
    """
    Phase 2: Unfreeze last N layers for fine-tuning on real data.
    """
    base.trainable = True
    for layer in base.layers[:-num_layers]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-5),  # Very low LR
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model