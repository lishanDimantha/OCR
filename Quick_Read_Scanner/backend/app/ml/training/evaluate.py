"""
evaluate.py — Model accuracy reporting + training charts
"""

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from sklearn.metrics import classification_report, confusion_matrix
import logging
import os

log = logging.getLogger(__name__)
LETTERS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


def evaluate_model(model, val_data, letters=LETTERS):
    """
    Full evaluation:
      - Overall accuracy
      - Per-letter accuracy
      - Confusion matrix
      - Problem letters (accuracy < 80%)
    """
    log.info("Running evaluation on validation set...")

    # Collect predictions
    y_true, y_pred = [], []

    try:
        # tf.data pipeline
        for images, labels in val_data:
            preds = model.predict(images, verbose=0)
            y_pred.extend(np.argmax(preds, axis=1))
            if hasattr(labels, 'numpy'):
                y_true.extend(labels.numpy())
            else:
                y_true.extend(np.argmax(labels, axis=1))
            if len(y_true) > 5000:   # enough for evaluation
                break
    except Exception as e:
        log.warning(f"Evaluation loop error: {e}")
        return

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    # Overall accuracy
    overall_acc = np.mean(y_true == y_pred) * 100
    log.info(f"\n{'='*50}")
    log.info(f"  Overall Accuracy : {overall_acc:.1f}%")
    log.info(f"{'='*50}")

    # Per-letter accuracy
    log.info("\nPer-letter accuracy:")
    problem_letters = []
    for i, letter in enumerate(letters):
        mask = y_true == i
        if mask.sum() == 0:
            continue
        acc = np.mean(y_pred[mask] == i) * 100
        bar = "█" * int(acc / 5)
        status = "✅" if acc >= 80 else "⚠️ "
        log.info(f"  {letter}  {bar:<20}  {acc:.0f}% {status}")
        if acc < 80:
            problem_letters.append((letter, acc))

    if problem_letters:
        log.info("\n⚠️  Problem letters (< 80% accuracy):")
        for letter, acc in problem_letters:
            log.info(f"    {letter}: {acc:.0f}% — collect more samples!")

    # Sklearn classification report
    valid_mask = y_true < len(letters)
    print("\n" + classification_report(
        y_true[valid_mask],
        y_pred[valid_mask],
        target_names=letters[:max(y_true)+1]
    ))

    # Save confusion matrix
    _save_confusion_matrix(y_true, y_pred, letters)


def _save_confusion_matrix(y_true, y_pred, letters):
    """Save confusion matrix as PNG."""
    try:
        cm = confusion_matrix(y_true, y_pred)
        n  = len(set(y_true))
        fig, ax = plt.subplots(figsize=(14, 12))
        im = ax.imshow(cm, cmap='Blues')
        ax.set_xticks(range(n))
        ax.set_yticks(range(n))
        ax.set_xticklabels(letters[:n], fontsize=9)
        ax.set_yticklabels(letters[:n], fontsize=9)
        ax.set_xlabel("Predicted")
        ax.set_ylabel("True")
        ax.set_title("Confusion Matrix — Letter Recognition")
        plt.colorbar(im)
        os.makedirs("logs", exist_ok=True)
        path = "logs/confusion_matrix.png"
        plt.tight_layout()
        plt.savefig(path, dpi=120)
        plt.close()
        log.info(f"  Confusion matrix saved → {path}")
    except Exception as e:
        log.warning(f"Could not save confusion matrix: {e}")


def plot_training_history(history_p1, history_p2=None):
    """
    Plot accuracy + loss curves for both training phases.
    Saved to logs/training_history.png
    """
    try:
        has_p2 = history_p2 is not None
        cols   = 2 if has_p2 else 1
        fig    = plt.figure(figsize=(14, 5))
        gs     = gridspec.GridSpec(1, cols * 2, figure=fig)

        def _plot_phase(h, col_start, title):
            ax1 = fig.add_subplot(gs[0, col_start])
            ax1.plot(h.history['accuracy'],     label='Train', color='#185FA5', linewidth=2)
            ax1.plot(h.history['val_accuracy'], label='Val',   color='#1D9E75', linewidth=2)
            ax1.set_title(f"{title} — Accuracy")
            ax1.set_xlabel("Epoch")
            ax1.set_ylabel("Accuracy")
            ax1.set_ylim(0, 1)
            ax1.legend()
            ax1.grid(True, alpha=0.3)

            ax2 = fig.add_subplot(gs[0, col_start + 1])
            ax2.plot(h.history['loss'],     label='Train', color='#A32D2D', linewidth=2)
            ax2.plot(h.history['val_loss'], label='Val',   color='#BA7517', linewidth=2)
            ax2.set_title(f"{title} — Loss")
            ax2.set_xlabel("Epoch")
            ax2.set_ylabel("Loss")
            ax2.legend()
            ax2.grid(True, alpha=0.3)

        _plot_phase(history_p1, 0, "Phase 1 (EMNIST)")
        if has_p2:
            _plot_phase(history_p2, 2, "Phase 2 (Fine-tune)")

        plt.tight_layout()
        path = "logs/training_history.png"
        plt.savefig(path, dpi=120)
        plt.close()
        log.info(f"  Training history chart saved → {path}")
    except Exception as e:
        log.warning(f"Could not plot training history: {e}")