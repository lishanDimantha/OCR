import numpy as np
from app.core.gemini_ocr import ocr_gemini

async def run_ocr_engines(image_np: np.ndarray) -> dict:
    """
    Main OCR pipeline using Gemini Vision purely.
    """

    gemini_result = await ocr_gemini(image_np)

    if gemini_result["success"] and gemini_result["rx_items"]:

        rx_items   = gemini_result["rx_items"]

        drug_words = [item["drug"] for item in rx_items]

        return {
            "status":       "success",
            "text":         gemini_result["text"],
            "drug_words":   drug_words,
            "rx_items":     rx_items,
            "confidence":   gemini_result["confidence"],
            "method":       "gemini_vision",
            "needs_manual": False,
            "engines": {
                "gemini": gemini_result,
            },
        }
        
    # If Gemini fails, we go straight to manual review
    return {
        "status":       "manual_needed",
        "text":         gemini_result.get("text", "") or gemini_result.get("error", "Failed to detect text via Gemini"),
        "drug_words":   [],
        "rx_items":     [],
        "confidence":   0,
        "method":       "gemini_failed",
        "needs_manual": True,
        "engines": {
            "gemini": gemini_result,
        },
    }