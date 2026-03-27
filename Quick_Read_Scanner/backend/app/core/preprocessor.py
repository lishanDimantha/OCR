"""
Advanced Image Preprocessor for Doctor Handwriting
Optimized for dark, angled, cursive prescription images
"""
import cv2
import numpy as np


def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Full preprocessing pipeline for OCR.
    Returns cleaned binary image.
    """
    # Step 1: Auto-rotate/deskew
    image = auto_rotate(image)

    # Step 2: Enhance contrast (handles dark images)
    enhanced = enhance_contrast(image)

    # Step 3: Denoise
    denoised = denoise(enhanced)

    # Step 4: Binarize (black text on white)
    binary = binarize(denoised)

    # Step 5: Remove noise blobs
    cleaned = remove_noise(binary)

    return cleaned


def auto_rotate(image: np.ndarray) -> np.ndarray:
    """Auto-detect and correct image rotation."""
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) \
               if len(image.shape) == 3 else image.copy()
        # Detect edges
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        lines = cv2.HoughLinesP(edges, 1, np.pi/180,
                                threshold=80,
                                minLineLength=100,
                                maxLineGap=10)
        if lines is None:
            return image
        angles = []
        for line in lines:
            x1, y1, x2, y2 = line[0]
            if x2 - x1 != 0:
                angle = np.degrees(np.arctan2(y2-y1, x2-x1))
                if -45 < angle < 45:
                    angles.append(angle)
        if not angles:
            return image
        median_angle = np.median(angles)
        if abs(median_angle) < 0.5:
            return image
        h, w = image.shape[:2]
        center = (w//2, h//2)
        M = cv2.getRotationMatrix2D(center, median_angle, 1.0)
        rotated = cv2.warpAffine(
            image, M, (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )
        return rotated
    except Exception:
        return image


def enhance_contrast(image: np.ndarray) -> np.ndarray:
    """
    CLAHE contrast enhancement — fixes dark/underexposed images.
    Also handles overexposed images.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) \
           if len(image.shape) == 3 else image.copy()

    # Check brightness
    mean_brightness = np.mean(gray)

    # Very dark image → gamma correction first
    if mean_brightness < 80:
        gamma   = 2.0
        inv_gamma = 1.0 / gamma
        table = np.array([
            ((i / 255.0) ** inv_gamma) * 255
            for i in range(256)
        ]).astype("uint8")
        gray = cv2.LUT(gray, table)

    # CLAHE (best for handwriting)
    clahe  = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    result = clahe.apply(gray)

    return result


def denoise(image: np.ndarray) -> np.ndarray:
    """Remove noise while preserving text edges."""
    gray = image if len(image.shape) == 2 else \
           cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Bilateral filter — preserves edges better than Gaussian
    denoised = cv2.bilateralFilter(gray, 9, 75, 75)

    # Additional NL means for heavy noise
    denoised = cv2.fastNlMeansDenoising(denoised, h=8)

    return denoised


def binarize(image: np.ndarray) -> np.ndarray:
    """
    Smart binarization — tries multiple methods,
    picks best result for handwriting.
    """
    gray = image if len(image.shape) == 2 else \
           cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Method 1: Otsu (good for uniform lighting)
    _, otsu = cv2.threshold(
        gray, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    # Method 2: Adaptive Gaussian (good for shadows/uneven)
    adaptive = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 25, 10
    )

    # Method 3: Adaptive Mean
    adaptive_mean = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_MEAN_C,
        cv2.THRESH_BINARY, 25, 10
    )

    # Pick best: compare text pixel density
    def text_score(img):
        black = np.sum(img == 0)
        total = img.size
        ratio = black / total
        # Good text ratio: 5-40%
        return 1.0 - abs(ratio - 0.15)

    scores = [
        (text_score(otsu),          otsu),
        (text_score(adaptive),      adaptive),
        (text_score(adaptive_mean), adaptive_mean),
    ]
    best = max(scores, key=lambda x: x[0])[1]
    return best


def remove_noise(binary: np.ndarray) -> np.ndarray:
    """Remove small noise blobs, keep text."""
    # Remove tiny specks
    kernel_small = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE, (2, 2))
    opened = cv2.morphologyEx(
        binary, cv2.MORPH_OPEN, kernel_small)

    # Close small gaps in letters
    kernel_close = cv2.getStructuringElement(
        cv2.MORPH_RECT, (2, 1))
    closed = cv2.morphologyEx(
        opened, cv2.MORPH_CLOSE, kernel_close)

    return closed


def preprocess_for_tesseract(image: np.ndarray) -> np.ndarray:
    """
    Special preprocessing optimized for Tesseract LSTM.
    Returns high-resolution grayscale image.
    """
    # Full pipeline
    processed = preprocess_image(image)

    # Invert if needed (Tesseract prefers black text on white)
    if np.mean(processed) < 128:
        processed = cv2.bitwise_not(processed)

    # Scale up 2x for better Tesseract accuracy
    h, w = processed.shape[:2]
    scaled = cv2.resize(
        processed, (w*2, h*2),
        interpolation=cv2.INTER_CUBIC
    )

    return scaled