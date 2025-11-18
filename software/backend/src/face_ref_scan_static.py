import cv2
import numpy as np
import os
from PIL import Image

# Get the absolute path to the cascade file relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CASCADE_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'haarcascade_frontalface_default.xml')
CASCADE_PATH = os.path.abspath(CASCADE_PATH)

# ---------- SHEET DETECTION ----------

def detect_sheet_presence(roi):
    if roi is None or roi.size == 0:
        return False

    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    kernel = np.ones((5, 5), np.uint8)
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
    closed = cv2.dilate(closed, kernel, iterations=1)

    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return False

    roi_h, roi_w = gray.shape
    roi_area = roi_h * roi_w
    best_area = max([cv2.contourArea(c) for c in contours])
    return best_area > 0.25 * roi_area

# ---------- FACE DETECTION & SKIN REGIONS ----------

def define_face(img, show_windows=False):
    if img is None:
        print("define_face: no image passed in.")
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
    if face_cascade.empty():
        print("Error: Could not load Haar cascade XML file.")
        return None

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80))
    if len(faces) == 0:
        print("No faces detected.")
        return None

    faces = list(faces)
    faces.sort(key=lambda f: f[2] * f[3], reverse=True)
    (x, y, w, h) = faces[0]
    print("Face box:", x, y, w, h)

    if show_windows:
        face_dbg = img.copy()
        cv2.rectangle(face_dbg, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.imshow("Detected Face", face_dbg)

    face = img[y:y + h, x:x + w]
    return face

def sample_skin_regions(face):
    if face is None or face.size == 0:
        print("No face ROI passed to sample_skin_regions.")
        return np.array([])

    h, w, _ = face.shape
    samples = []

    def region_mean(x1, y1, x2, y2, n_samples=1):
        sub = face[y1:y2, x1:x2]
        H, W, _ = sub.shape
        rgb_points = []
        for i in range(n_samples):
            cy = int((i + 0.5) * H / n_samples)
            cx = int(W / 2)
            rgb_points.append(sub[cy, cx, ::-1])  # BGR → RGB
        return np.array(rgb_points)

    # Forehead (2 samples)
    fh_y1, fh_y2 = int(0.05 * h), int(0.25 * h)
    fh_x1, fh_x2 = int(0.25 * w), int(0.75 * w)
    samples.append(region_mean(fh_x1, fh_y1, fh_x2, fh_y2, n_samples=2))

    # Nose (2 samples)
    ns_y1, ns_y2 = int(0.35 * h), int(0.65 * h)
    ns_x1, ns_x2 = int(0.40 * w), int(0.60 * w)
    samples.append(region_mean(ns_x1, ns_y1, ns_x2, ns_y2, n_samples=2))

    # Left cheek (3 samples)
    lc_y1, lc_y2 = int(0.45 * h), int(0.75 * h)
    lc_x1, lc_x2 = int(0.10 * w), int(0.35 * w)
    samples.append(region_mean(lc_x1, lc_y1, lc_x2, lc_y2, n_samples=3))

    # Right cheek (3 samples)
    rc_y1, rc_y2 = int(0.45 * h), int(0.75 * h)
    rc_x1, rc_x2 = int(0.65 * w), int(0.90 * w)
    samples.append(region_mean(rc_x1, rc_y1, rc_x2, rc_y2, n_samples=3))

    all_samples = np.vstack(samples)
    print("Skin RGB samples:\n", all_samples)
    return all_samples

# ---------- SHEET / MACBETH PROCESSING ----------

def detect_sheet(img):
    if img is None:
        return img, None

    orig = img.copy()
    gray = cv2.cvtColor(orig, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    kernel = np.ones((5, 5), np.uint8)
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
    closed = cv2.dilate(closed, kernel, iterations=1)

    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return orig, None

    sheet_contour = max(contours, key=cv2.contourArea)
    return orig, sheet_contour

def crop_to_chart_only(sheet_roi, debug=False):
    if sheet_roi is None:
        return None

    orig = sheet_roi.copy()
    gray = cv2.cvtColor(orig, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    if np.mean(gray[thresh == 255]) > np.mean(gray[thresh == 0]):
        thresh = 255 - thresh

    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return sheet_roi

    chart_cnt = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(chart_cnt)
    chart_only = orig[y:y + h, x:x + w]
    return chart_only

def extract_macbeth_patches(warped, rows=4, cols=6, outer_margin=0.08, inner_margin=0.08, debug=False):
    if warped is None:
        return []

    H, W, _ = warped.shape
    x0, x1 = int(outer_margin * W), int((1.0 - outer_margin) * W)
    y0, y1 = int(outer_margin * H), int((1.0 - outer_margin) * H)
    chart = warped[y0:y1, x0:x1].copy()
    ch, cw, _ = chart.shape

    patch_h = ch // rows
    patch_w = cw // cols
    inner_h_margin = int(patch_h * inner_margin)
    inner_w_margin = int(patch_w * inner_margin)

    patches = []
    for r in range(rows):
        for c in range(cols):
            py0 = r * patch_h + inner_h_margin
            py1 = (r + 1) * patch_h - inner_h_margin
            px0 = c * patch_w + inner_w_margin
            px1 = (c + 1) * patch_w - inner_w_margin
            patch = chart[py0:py1, px0:px1]
            mean_bgr = patch.mean(axis=(0, 1))
            patches.append({
                "index": r * cols + c + 1,
                "row": r + 1,
                "col": c + 1,
                "mean_bgr": mean_bgr
            })
    return patches

# ---------- IMAGE ANALYSIS ENTRY POINT ----------

def analyze_image(image_path):
    """Analyze a static image instead of live feed."""
    img = cv2.imread(image_path)
    if img is None:
        print("Failed to load image.")
        return None, None

    face_roi = define_face(img)
    if face_roi is None:
        print("No face detected.")
        return None, None

    skin_rgb = sample_skin_regions(face_roi)

    # Assume the Macbeth sheet is the largest contour in the image
    _, sheet_contour = detect_sheet(img)
    if sheet_contour is None:
        print("No sheet detected.")
        return skin_rgb, None
    print("Sheet contour detected.")

    sheet_roi = img  # Could crop to contour if needed
    chart = crop_to_chart_only(sheet_roi, debug=False)
    patches = extract_macbeth_patches(chart, outer_margin=0.08, inner_margin=0.05, debug=False)
    reference_rgb = np.array([p['mean_bgr'][::-1] for p in patches])  # BGR → RGB

    return skin_rgb, reference_rgb

# ---------- MAIN ----------

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python analyze_image.py <image_path>")
        sys.exit(1)
    image_path = sys.argv[1]
    skin, reference = analyze_image(image_path)
    print("Skin samples:\n", skin)
    print("Reference patches:\n", reference)
