import cv2
import numpy as np

def segment_words(binary_image):
    """
    Segment image into individual words.
    Returns list of word strings (predicted by ML model).
    """
    # Dilate to connect letters within a word
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 3))
    dilated = cv2.dilate(binary_image, kernel, iterations=1)

    contours, _ = cv2.findContours(
        dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    word_images = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if w > 20 and h > 10:  # filter noise
            word_img = binary_image[y:y+h, x:x+w]
            word_images.append((x, y, word_img))

    # Sort left-to-right, top-to-bottom
    word_images.sort(key=lambda b: (b[1] // 40, b[0]))

    return [img for _, _, img in word_images]


def segment_letters(word_image):
    """
    Segment a word image into individual letter images.
    Returns list of (letter_image, x_position) tuples sorted left→right.
    """
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(
        word_image, connectivity=8
    )

    letters = []
    for i in range(1, num_labels):
        x = stats[i, cv2.CC_STAT_LEFT]
        y = stats[i, cv2.CC_STAT_TOP]
        w = stats[i, cv2.CC_STAT_WIDTH]
        h = stats[i, cv2.CC_STAT_HEIGHT]
        area = stats[i, cv2.CC_STAT_AREA]

        if area > 30:
            letter_img = word_image[y:y+h, x:x+w]
            # Resize to 64x64 for model input
            letter_img = cv2.resize(letter_img, (64, 64))
            letters.append((x, letter_img))

    # Sort left to right
    letters.sort(key=lambda t: t[0])
    return [img for _, img in letters]