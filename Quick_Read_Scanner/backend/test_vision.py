import asyncio, cv2, os, sys, io
sys.path.insert(0, os.path.dirname(__file__))
from dotenv import load_dotenv
load_dotenv()

from app.core.gemini_ocr import ocr_gemini
from app.core.ocr_engine import run_ocr_engines

TEST_IMAGE = r"D:\OCR system\data\raw\prescriptions\11.jpg"

async def test():
    print("="*60)
    print("  PRESCRIPTION OCR — ENGINE TEST")
    print("="*60)

    img = cv2.imread(TEST_IMAGE)
    if img is None:
        # Try any jpg in folder
        folder = r"D:\OCR system\data\raw\prescriptions"
        for f in os.listdir(folder):
            if f.lower().endswith(('.jpg','.jpeg','.png')):
                img = cv2.imread(os.path.join(folder, f))
                print(f"Using: {f}")
                break

    if img is None:
        print(f"❌ No image found in prescriptions folder")
        return

    print(f"✅ Image: {img.shape}")

    # Run full pipeline to avoid double-calling the Gemini API (which causes Rate Limits leading to Tesseract fallback)
    result = await run_ocr_engines(img)
    g = result["engines"].get("gemini", {})
    

 # Print Gemini Output
    print("\n--- GEMINI VISION ---")
    if g:
        print(f"Success:    {g.get('success', False)}")
        print(f"Confidence: {g.get('confidence', 0)}%")
        if g.get('error'):
            print(f"Error:      {g['error']}")
        print(f"Raw text:\n{g.get('text', '')[:400]}")
        rx_items = g.get('rx_items', [])
        print(f"\nParsed items: {len(rx_items)}")
        for item in rx_items:
            print(f"  Drug: {item['drug']}")
            print(f"    Dosage:  {item['dosage']}")
            print(f"    Qty:     {item['quantity']}")
            print(f"    Notes:   {item['instructions'][:80]}")



    # Print Full Pipeline Selection
    print("\n--- FULL PIPELINE ---")
    print(f"Method:     {result['method']}")
    print(f"Confidence: {result['confidence']}%")
    print(f"Drugs found: {len(result['rx_items'])}")
    for i, item in enumerate(result['rx_items'], 1):
        print(f"\n  [{i}] {item['drug']}")
        print(f"      Dosage:       {item['dosage']}")
        print(f"      Qty:          {item['quantity']}")
        print(f"      Instructions: {item['instructions'][:100]}")

if __name__ == "__main__":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    except Exception:
        pass
    asyncio.run(test())