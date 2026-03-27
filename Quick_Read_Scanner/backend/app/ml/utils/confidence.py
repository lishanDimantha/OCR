import numpy as np

LETTERS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

def predict_letter(model, letter_image) -> dict:
    """
    Predict single letter from image using CNN model.
    Returns letter + confidence score.
    """
    img = letter_image.reshape(1, 64, 64, 1).astype('float32') / 255.0
    prediction = model.predict(img, verbose=0)[0]
    confidence = float(np.max(prediction)) * 100
    predicted = LETTERS[np.argmax(prediction)]

    if confidence >= 90:
        status = "auto"       # Auto approve 
    elif confidence >= 70:
        status = "review"     # Flag for review 
    else:
        status = "manual"     # Manual input 

    return {
        "letter": predicted,
        "confidence": round(confidence, 1),
        "status": status
    }

def predict_word(model, letter_images) -> dict:
    """
    Predict full word from list of letter images.
    Returns word string + per-letter confidence array.
    """
    letter_results = [predict_letter(model, img) for img in letter_images]
    word = "".join([r["letter"] for r in letter_results])
    avg_confidence = np.mean([r["confidence"] for r in letter_results])

    return {
        "word": word,
        "letters": letter_results,
        "avg_confidence": round(float(avg_confidence), 1),
        "letter_array": [r["letter"] for r in letter_results]
    }