"""
Prescription OCR — Letter Labeling Tool
Controls:
  Mouse drag → Draw box around a letter
  A-Z keys   → Label the selected letter
  N          → Next image
  P          → Previous image
  D          → Delete last box
  S          → Show stats
  Q          → Quit
"""

import cv2
import os
from datetime import datetime

INPUT_DIR  = r"D:\OCR system\data\raw\prescriptions"
OUTPUT_DIR = r"D:\OCR system\data\processed\letters\train"
IMG_SIZE   = 64

# Global state
drawing = False
sx = sy = ex = ey = 0
has_box = False
current_img = None

os.makedirs(OUTPUT_DIR, exist_ok=True)
for L in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
    os.makedirs(os.path.join(OUTPUT_DIR, L), exist_ok=True)


def count_existing():
    counts = {}
    for L in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        d = os.path.join(OUTPUT_DIR, L)
        counts[L] = len([f for f in os.listdir(d)
                         if f.lower().endswith(('.png','.jpg'))])
    return counts


def save_letter(img, x1, y1, x2, y2, label):
    x1,y1,x2,y2 = min(x1,x2),min(y1,y2),max(x1,x2),max(y1,y2)
    if x2-x1 < 5 or y2-y1 < 5:
        return False
    crop = img[y1:y2, x1:x2]
    if crop.size == 0:
        return False
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY) \
           if len(crop.shape)==3 else crop
    _, thresh = cv2.threshold(gray, 0, 255,
                              cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    resized  = cv2.resize(thresh, (IMG_SIZE, IMG_SIZE))
    out_dir  = os.path.join(OUTPUT_DIR, label.upper())
    ts       = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    cv2.imwrite(os.path.join(out_dir, f"{label}_{ts}.png"), resized)
    return True


def draw_ui(img, boxes, idx, total, fname):
    disp   = img.copy()
    counts = count_existing()
    total_saved = sum(counts.values())
    h, w   = disp.shape[:2]

    # Saved boxes
    for (x1,y1,x2,y2,lbl) in boxes:
        cv2.rectangle(disp,(x1,y1),(x2,y2),(0,200,100),2)
        cv2.putText(disp,lbl,(x1,y1-6),
                    cv2.FONT_HERSHEY_SIMPLEX,0.7,(0,200,100),2)

    # Top bar
    cv2.rectangle(disp,(0,0),(w,36),(30,30,30),-1)
    cv2.putText(disp,
        f"[{idx}/{total}] {fname}  |  Saved:{total_saved}  Boxes:{len(boxes)}",
        (8,24), cv2.FONT_HERSHEY_SIMPLEX, 0.55,(255,255,255),1)

    # Controls hint
    cv2.rectangle(disp,(0,36),(w,58),(50,50,50),-1)
    cv2.putText(disp,
        "Drag=select  A-Z=label  N=next  P=prev  D=delete  S=stats  Q=quit",
        (8,52), cv2.FONT_HERSHEY_SIMPLEX, 0.42,(200,200,200),1)

    # Bottom letter count bar
    cv2.rectangle(disp,(0,h-28),(w,h),(20,20,20),-1)
    bar_w = max(w//26, 1)
    for i,L in enumerate("ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
        cnt   = counts[L]
        color = (0,200,100) if cnt>=50 else \
                (0,180,220) if cnt>=20 else (80,80,200)
        cv2.putText(disp,f"{L}:{cnt}",(i*bar_w+2,h-8),
                    cv2.FONT_HERSHEY_SIMPLEX,0.3,color,1)
    return disp


def mouse_cb(event, x, y, flags, param):
    global drawing, sx, sy, ex, ey, has_box, current_img
    boxes, idx, total, fname = param

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        sx, sy  = x, y
        has_box = False

    elif event == cv2.EVENT_MOUSEMOVE and drawing:
        if current_img is not None:
            tmp = draw_ui(current_img, boxes, idx, total, fname)
            cv2.rectangle(tmp,(sx,sy),(x,y),(255,165,0),2)
            cv2.imshow("Label Tool", tmp)

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        ex, ey  = x, y
        has_box = True
        if current_img is not None:
            tmp = draw_ui(current_img, boxes, idx, total, fname)
            cv2.rectangle(tmp,(sx,sy),(ex,ey),(0,165,255),2)
            cv2.putText(tmp,"Press A-Z key to label this letter",
                        (sx, max(sy-8,20)),
                        cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,165,255),2)
            cv2.imshow("Label Tool", tmp)


def print_stats():
    counts = count_existing()
    total  = sum(counts.values())
    print(f"\n{'='*42}")
    print(f"  Total letters saved: {total}")
    print(f"{'='*42}")
    for L in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        cnt  = counts[L]
        bar  = "█" * min(cnt//5, 20)
        flag = "✅" if cnt>=50 else "⚠️ " if cnt>=20 else "❌"
        print(f"  {L}  {bar:<20}  {cnt:3d}  {flag}")
    print(f"{'='*42}\n")


def load_image(path):
    img = cv2.imread(path)
    if img is None:
        return None
    h, w = img.shape[:2]
    if w > 1200:
        scale = 1200 / w
        img   = cv2.resize(img,(1200, int(h*scale)))
    return img


def run():
    global current_img, has_box, sx, sy, ex, ey

    images = sorted([f for f in os.listdir(INPUT_DIR)
                     if f.lower().endswith(('.jpg','.jpeg','.png'))])
    if not images:
        print(f"\n❌ No images in: {INPUT_DIR}")
        return

    print(f"\n✅ Found {len(images)} prescription images")
    print("="*50)
    print("  Drag=select  A-Z=label  N=next  P=prev")
    print("  D=delete  S=stats  Q=quit")
    print("="*50)

    cv2.namedWindow("Label Tool", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Label Tool", 960, 720)

    idx = 0   # current image index
    while 0 <= idx < len(images):
        fname = images[idx]
        path  = os.path.join(INPUT_DIR, fname)
        img   = load_image(path)

        if img is None:
            print(f"  ⚠️  Cannot read: {fname}")
            idx += 1
            continue

        current_img = img
        boxes       = []
        has_box     = False
        sx = sy = ex = ey = 0
        action      = 'next'   # 'next' | 'prev' | 'quit'

        cv2.setMouseCallback("Label Tool", mouse_cb,
                             (boxes, idx+1, len(images), fname))
        print(f"\n[{idx+1}/{len(images)}] {fname}")

        while True:
            disp = draw_ui(current_img, boxes,
                           idx+1, len(images), fname)
            cv2.imshow("Label Tool", disp)
            key  = cv2.waitKey(20) & 0xFF

            # Quit
            if key in (ord('q'), 27):
                action = 'quit'
                break

            # Next image
            elif key == ord('n'):
                print(f"  → Next  ({len(boxes)} labels this image)")
                action = 'next'
                break

            # Previous image ← NEW
            elif key == ord('p'):
                print(f"  ← Previous")
                action = 'prev'
                break

            # Delete last box
            elif key == ord('d') and boxes:
                removed = boxes.pop()
                print(f"  ← Deleted: {removed[4]}")

            # Stats
            elif key == ord('s'):
                print_stats()

            # Label letter A-Z
            elif has_box and (65<=key<=90 or 97<=key<=122):
                label = chr(key).upper()
                if save_letter(current_img, sx, sy, ex, ey, label):
                    boxes.append((min(sx,ex), min(sy,ey),
                                  max(sx,ex), max(sy,ey), label))
                    cnt = count_existing()[label]
                    print(f"  ✅ Saved: {label}  (total {label}: {cnt})")
                has_box = False
                sx = sy = ex = ey = 0

        if action == 'quit':
            print("\n✅ Labeling session complete!")
            print_stats()
            cv2.destroyAllWindows()
            return
        elif action == 'next':
            idx += 1
        elif action == 'prev':
            idx = max(0, idx - 1)

    print("\n🎉 All images done!")
    print_stats()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run()