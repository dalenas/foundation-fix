# src/color_algorithm.py
from face_ref_scan_static import analyze_image
from rgb_to_lab import gamma_to_linear, lighting_correction, linear_to_xyz, xyz_to_lab, median_lab
import numpy as np

# ---------- BASE SKIN TONE ----------
# You can adjust this to your preferred canonical skin tone
BASE_SKIN_LAB = np.array([70.0, 15.0, 20.0])  # L*, a*, b*

# ---------- LAB -> HEX ----------
def lab_to_hex_single(lab):
    L, a, b = lab
    # Lab -> XYZ
    y = (L + 16.0) / 116.0
    x = y + a / 500.0
    z = y - b / 200.0

    def inv_f(t):
        t3 = t**3
        return t3 if t3 > 0.008856 else (t - 16.0/116.0) / 7.787

    X = inv_f(x) * 0.95047
    Y = inv_f(y) * 1.00000
    Z = inv_f(z) * 1.08883

    # XYZ -> linear sRGB
    M = np.array([
        [ 3.2406, -1.5372, -0.4986],
        [-0.9689,  1.8758,  0.0415],
        [ 0.0557, -0.2040,  1.0570]
    ])
    rgb_lin = M @ np.array([X, Y, Z])
    rgb_lin = np.clip(rgb_lin, 0.0, None)

    # gamma correction
    rgb = np.where(rgb_lin <= 0.0031308,
                   12.92 * rgb_lin,
                   1.055 * (rgb_lin ** (1.0/2.4)) - 0.055)
    rgb = np.clip(rgb, 0.0, 1.0)

    # optional tweak: prevent very low RGB (avoids grey/black)
    rgb = np.maximum(rgb, 0.03)

    r, g, b = (rgb * 255.0).astype(int)
    return '#{:02X}{:02X}{:02X}'.format(r, g, b)

# ---------- FILTER SKIN PIXELS ----------
def filter_skin_pixels(rgb_pixels):
    arr = np.asarray(rgb_pixels).reshape(-1, 3)
    if arr.size == 0:
        return arr
    R, G, B = arr[:,0], arr[:,1], arr[:,2]

    # basic skin heuristics
    mask = (R > 40) & (R > G) & (G > B - 10)
    filtered = arr[mask]

    # remove top 5% luminance highlights
    lum = 0.2126*filtered[:,0] + 0.7152*filtered[:,1] + 0.0722*filtered[:,2]
    thresh = np.percentile(lum, 95)
    filtered = filtered[lum <= thresh]

    if filtered.shape[0] < max(3, arr.shape[0] // 10):
        filtered = arr[mask] if arr[mask].size else arr

    return filtered

# ---------- IMAGE -> HEX WITH BASE SKIN NORMALIZATION ----------
def image_to_hex(image_path, debug=False):
    skin_pixels, reference_rgb = analyze_image(image_path)
    if skin_pixels is None or skin_pixels.size == 0:
        raise ValueError("No skin pixels detected")

    if reference_rgb is None or reference_rgb.size == 0 and debug:
        print("Warning: no reference patches detected; lighting correction skipped")

    # filter skin pixels (0..255)
    filtered = filter_skin_pixels(skin_pixels)
    if debug:
        print("Filtered skin count:", filtered.shape[0])

    # normalize to 0..1
    skin_norm = filtered.astype(np.float64) / 255.0
    ref_norm = reference_rgb.astype(np.float64)/255.0 if reference_rgb is not None else None

    # linearize
    skin_lin = gamma_to_linear(skin_norm)
    ref_lin = gamma_to_linear(ref_norm) if ref_norm is not None else None

    # lighting correction using reference patches
    corrected_skin = lighting_correction(skin_lin, ref_lin) if ref_lin is not None else skin_lin

    # convert linear -> XYZ -> Lab
    xyz = linear_to_xyz(corrected_skin)
    lab = xyz_to_lab(xyz)

    # median Lab for image
    lab_med = median_lab(lab)

    # -------- BASE SKIN NORMALIZATION --------
    # Scale Lab to match canonical skin tone
    lab_corrected = BASE_SKIN_LAB * (lab_med / (lab_med + 1e-8))
    # optional: blend with original to preserve hue slightly
    lab_med = 0.4 * lab_med + 0.6 * lab_corrected

    # convert to HEX
    hex_color = lab_to_hex_single(lab_med)
    if debug:
        print("lab_med:", lab_med, "hex:", hex_color)
    return hex_color
