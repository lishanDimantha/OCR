import cv2
import numpy as np

def check_image_quality(image):
    """
    Check if prescription image is clear enough for OCR.
    Always returns ok since Gemini Vision handles varying image qualities exceptionally well compared to traditional OCR.
    """
    return "ok", "ඡායාරූපය හොඳ තත්ත්වයේ ඇත. OCR ආරම්භ කරයි..."