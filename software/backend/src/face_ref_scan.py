import cv2
import numpy as np

CASCADE_PATH = 'software/backend/data/haarcascade_frontalface_default.xml'


# ---------- LIVE FEED: CAPTURE FRAME WHEN SHEET IN BOX ----------

def capture_frame_with_sheet_box():
    """
    Live feed with a guide box.
    When a large blob (likely the sheet) stays inside the box for
    several consecutive frames, automatically capture.
    Press 'q' to quit without capturing.
    """
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return None, None

    captured = None
    box_coords = None

    stable_frames = 0
    STABLE_NEEDED = 10  # increase if it still triggers too quickly

    while True:
        ret, frame = cap.read()

        if not ret:
            print("Error: Failed to read frame.")
            break

        # OPTIONAL: unmirror preview but keep processing unflipped frame:
        display = cv2.flip(frame, 1)
        h, w, _ = frame.shape

        # Box tuned for your card size / position
        box_w = int(w * 0.4)
        box_h = int(h * 0.52)
        x1 = (w - box_w) // 2
        y1 = int(h * 0.45)
        x2 = x1 + box_w
        y2 = y1 + box_h

        # For detection, use the *original* frame coordinates
        roi = frame[y1:y2, x1:x2]
        sheet_present = detect_sheet_presence(roi)

        if sheet_present:
            stable_frames += 1
        else:
            stable_frames = 0

        color = (0, 255, 0) if sheet_present else (0, 255, 255)

        # Draw box on the flipped display image so it feels natural
        dx1, dx2 = w - x2, w - x1  # flip coordinates horizontally
        cv2.rectangle(display, (dx1, y1), (dx2, y2), color, 2)

        if sheet_present:
            msg = "Hold sheet steady in box..."
        else:
            msg = "Put sheet fully in box (press 'q' to quit)"

        if stable_frames >= STABLE_NEEDED:
            msg = "Capturing..."
            cv2.putText(display, msg, (30, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 1)
            cv2.imshow("Live feed", display)

            captured = frame.copy()
            box_coords = (x1, y1, x2, y2)
            break

        cv2.putText(display, msg, (30, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 1)

        cv2.imshow("Live feed", display)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return captured, box_coords


def detect_sheet_presence(roi):
    """
    Simple presence check: is there a single large blob (likely the sheet)
    in the ROI? Returns True/False.
    """
    if roi is None or roi.size == 0:
        return False

    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Otsu threshold: automatically picks a cutoff based on image histogram
    _, thresh = cv2.threshold(
        blurred, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    kernel = np.ones((5, 5), np.uint8)
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
    closed = cv2.dilate(closed, kernel, iterations=1)

    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL,
                                   cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return False

    roi_h, roi_w = gray.shape
    roi_area = roi_h * roi_w

    # Look for a single fairly big contour
    best_area = 0
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > best_area:
            best_area = area

    # Require the biggest blob to be at least 25% of the box
    return best_area > 0.25 * roi_area


# ---------- FACE DETECTION & SKIN REGIONS ----------

def define_face(img):
    if img is None:
        print("define_face: no image passed in.")
        return

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
    if face_cascade.empty():
        print("Error: Could not load Haar cascade XML file.")
        return
    else:
        print("Cascade loaded successfully!")

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80)
    )
    if len(faces) == 0:
        print("No faces detected.")
        return

    # choose largest face
    faces = list(faces)
    faces.sort(key=lambda f: f[2] * f[3], reverse=True)
    (x, y, w, h) = faces[0]
    print("Face box:", x, y, w, h)

    face_dbg = img.copy()
    cv2.rectangle(face_dbg, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.imshow("Detected Face", face_dbg)

    face = img[y:y + h, x:x + w]
    face_h, face_w, _ = face.shape
    cv2.imshow("Face ROI", face)

    # Forehead
    fh_y1 = int(0.05 * face_h)
    fh_y2 = int(0.25 * face_h)
    fh_x1 = int(0.25 * face_w)
    fh_x2 = int(0.75 * face_w)
    forehead = face[fh_y1:fh_y2, fh_x1:fh_x2]
    cv2.imshow("Forehead", forehead)

    # Nose
    ns_y1 = int(0.35 * face_h)
    ns_y2 = int(0.65 * face_h)
    ns_x1 = int(0.40 * face_w)
    ns_x2 = int(0.60 * face_w)
    nose = face[ns_y1:ns_y2, ns_x1:ns_x2]
    cv2.imshow("Nose", nose)

    # Left cheek
    lc_y1 = int(0.45 * face_h)
    lc_y2 = int(0.75 * face_h)
    lc_x1 = int(0.10 * face_w)
    lc_x2 = int(0.35 * face_w)
    left_cheek = face[lc_y1:lc_y2, lc_x1:lc_x2]
    cv2.imshow("Left cheek", left_cheek)

    # Right cheek
    rc_y1 = int(0.45 * face_h)
    rc_y2 = int(0.75 * face_h)
    rc_x1 = int(0.65 * face_w)
    rc_x2 = int(0.90 * face_w)
    right_cheek = face[rc_y1:rc_y2, rc_x1:rc_x2]
    cv2.imshow("Right cheek", right_cheek)

    cv2.waitKey(0)
    cv2.destroyAllWindows()
    return face

def sample_skin_regions(face):
    """
    Takes in a cropped face image and samples multiple RGB values
    from defined facial subregions (forehead, nose, cheeks).
    Returns a NumPy array of RGB samples.
    """

    if face is None or face.size == 0:
        print("No face ROI passed to sample_skin_regions.")
        return np.array([])

    h, w, _ = face.shape
    samples = []

    def region_mean(x1, y1, x2, y2, n_samples=1):
        """Return mean RGBs from n_samples evenly spaced within the region."""
        sub = face[y1:y2, x1:x2]
        H, W, _ = sub.shape
        rgb_points = []
        for i in range(n_samples):
            cy = int((i + 0.5) * H / n_samples)
            cx = int(W / 2)
            rgb_points.append(sub[cy, cx, ::-1])  # BGR → RGB
        return np.array(rgb_points)

    # --- Forehead (2 samples) ---
    fh_y1, fh_y2 = int(0.05 * h), int(0.25 * h)
    fh_x1, fh_x2 = int(0.25 * w), int(0.75 * w)
    samples.append(region_mean(fh_x1, fh_y1, fh_x2, fh_y2, n_samples=2))

    # --- Nose (2 samples) ---
    ns_y1, ns_y2 = int(0.35 * h), int(0.65 * h)
    ns_x1, ns_x2 = int(0.40 * w), int(0.60 * w)
    samples.append(region_mean(ns_x1, ns_y1, ns_x2, ns_y2, n_samples=2))

    # --- Left cheek (3 samples) ---
    lc_y1, lc_y2 = int(0.45 * h), int(0.75 * h)
    lc_x1, lc_x2 = int(0.10 * w), int(0.35 * w)
    samples.append(region_mean(lc_x1, lc_y1, lc_x2, lc_y2, n_samples=3))

    # --- Right cheek (3 samples) ---
    rc_y1, rc_y2 = int(0.45 * h), int(0.75 * h)
    rc_x1, rc_x2 = int(0.65 * w), int(0.90 * w)
    samples.append(region_mean(rc_x1, rc_y1, rc_x2, rc_y2, n_samples=3))

    all_samples = np.vstack(samples)
    print("Skin RGB samples:\n", all_samples)

    return all_samples
# ---------- SHEET / MACBETH PROCESSING ----------

def detect_sheet(img):
    """
    Detect a large sheet-like contour in the (already cropped) ROI.
    """
    if img is None:
        print("detect_sheet: no image passed in.")
        return img, None

    orig = img.copy()
    gray = cv2.cvtColor(orig, cv2.COLOR_BGR2GRAY)

    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    _, thresh = cv2.threshold(
        blurred, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    kernel = np.ones((5, 5), np.uint8)
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
    closed = cv2.dilate(closed, kernel, iterations=1)

    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL,
                                   cv2.CHAIN_APPROX_SIMPLE)
    print(f"Found {len(contours)} external contours in sheet ROI.")

    if not contours:
        print("No contours found at all.")
        return orig, None

    sheet_contour = None
    max_area = 0

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 5000:
            continue

        x, y, w, h = cv2.boundingRect(cnt)
        aspect = max(w, h) / (min(w, h) + 1e-6)

        if area > max_area and 0.5 < aspect < 3.0:
            max_area = area
            sheet_contour = cnt

        print(f"Contour area={area:.1f}, w={w}, h={h}, aspect={aspect:.2f}")

    annotated = orig.copy()
    if sheet_contour is None:
        print("No suitable sheet-like contour found.")
    else:
        print("Chosen sheet contour area:", max_area)
        cv2.drawContours(annotated, [sheet_contour], -1, (0, 255, 0), 3)

    cv2.imshow("Sheet Detection (ROI)", annotated)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    return annotated, sheet_contour




def crop_to_chart_only(sheet_roi, debug=True):
    """
    From the sheet ROI (paper + chart + maybe hands),
    find the darker chart area using a mask and crop to its bounding rectangle.
    No perspective warp is used.
    """
    if sheet_roi is None:
        return None

    orig = sheet_roi.copy()
    gray = cv2.cvtColor(orig, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Otsu threshold
    _, thresh = cv2.threshold(blurred, 0, 255,
                              cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # We want the darker chart to be white in the mask.
    # If bright stuff is white instead, invert.
    if np.mean(gray[thresh == 255]) > np.mean(gray[thresh == 0]):
        thresh = 255 - thresh

    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                   cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        print("No inner chart contour found.")
        return sheet_roi

    H, W = gray.shape
    img_area = H * W

    chart_cnt = None
    best_area = 0

    for cnt in contours:
        area = cv2.contourArea(cnt)
        # skip tiny blobs and blobs that are basically the whole ROI
        if area < 0.1 * img_area or area > 0.95 * img_area:
            continue

        x, y, w, h = cv2.boundingRect(cnt)
        aspect = max(w, h) / (min(w, h) + 1e-6)

        # chart-ish: big, roughly rectangular
        if 0.7 < aspect < 2.0 and area > best_area:
            best_area = area
            chart_cnt = cnt

    if chart_cnt is None:
        print("No suitable chart region found, using original ROI.")
        return sheet_roi

    x, y, w, h = cv2.boundingRect(chart_cnt)
    chart_only = orig[y:y + h, x:x + w]

    if debug:
        vis = orig.copy()
        cv2.rectangle(vis, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.imshow("Chart region on sheet ROI", vis)
        cv2.imshow("Chart only (no warp)", chart_only)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    return chart_only


def extract_macbeth_patches(warped, rows=4, cols=6,
                            outer_margin=0.08,
                            inner_margin=0.08,
                            debug=True):
    """
    Given the cropped chart image, split into 4x6 patches
    and compute mean BGR for each.
    """
    if warped is None:
        return []

    H, W, _ = warped.shape

    x0 = int(outer_margin * W)
    x1 = int((1.0 - outer_margin) * W)
    y0 = int(outer_margin * H)
    y1 = int((1.0 - outer_margin) * H)

    chart = warped[y0:y1, x0:x1].copy()
    ch, cw, _ = chart.shape

    patch_h = ch // rows
    patch_w = cw // cols

    inner_h_margin = int(patch_h * inner_margin)
    inner_w_margin = int(patch_w * inner_margin)

    patches = []
    vis = chart.copy()

    for r in range(rows):
        for c in range(cols):
            py0 = r * patch_h + inner_h_margin
            py1 = (r + 1) * patch_h - inner_h_margin
            px0 = c * patch_w + inner_w_margin
            px1 = (c + 1) * patch_w - inner_w_margin

            patch = chart[py0:py1, px0:px1]
            mean_bgr = patch.mean(axis=(0, 1))

            idx = r * cols + c + 1
            patches.append({
                "index": idx,
                "row": r + 1,
                "col": c + 1,
                "mean_bgr": mean_bgr
            })

            if debug:
                cv2.rectangle(vis, (px0, py0), (px1, py1), (0, 255, 0), 1)
                cv2.putText(vis, str(idx),
                            (px0 + 5, py0 + 15),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

    if debug:
        cv2.imshow("Macbeth patches grid", vis)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    return patches


# ---------- MAIN ----------

def main():
    # 1) Live feed: capture a frame when sheet is inside the box
    frame, sheet_box = capture_frame_with_sheet_box()
    if frame is None or sheet_box is None:
        print("No frame captured.")
        return

    # 2) From that captured frame, run face detection
    face_roi = define_face(frame)
    skin_rgb = sample_skin_regions(face_roi)
    print("\nSkin RGB array shape:", skin_rgb.shape)
    np.save("skin_rgb.npy", skin_rgb)
    print("Saved as skin_rgb.npy")
    # 3) Process the sheet inside the box
    x1, y1, x2, y2 = sheet_box
    sheet_roi = frame[y1:y2, x1:x2]

    # Optional: just for visualization / debugging
    detect_sheet(sheet_roi)

    # <-- IMPORTANT: pass the IMAGE (sheet_roi), not the contour
    chart = crop_to_chart_only(sheet_roi, debug=True)

    patches = extract_macbeth_patches(
        chart,
        outer_margin=0.08,
        inner_margin=0.05
    )

    rgb_array = np.array([p['mean_bgr'][::-1] for p in patches])  # reverse to RGB order

    print("\nRGB array shape:", rgb_array.shape)
    print("RGB array:\n", rgb_array)

    # Optional: reshape to match Macbeth layout (4 rows x 6 cols x 3 channels)
    rgb_grid = rgb_array.reshape((4, 6, 3))
    print("\nRGB grid shape:", rgb_grid.shape)

    # If you want to save it for later use:
    np.save("macbeth_rgb.npy", rgb_grid)
    print("Saved as macbeth_rgb.npy")

if __name__ == '__main__':
    main()
