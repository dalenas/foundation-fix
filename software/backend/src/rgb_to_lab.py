# src/rgb_to_lab.py
import numpy as np
from src.lib import constants as const

# ---------- GAMMA → LINEAR ----------
def gamma_to_linear(gamma_codes):
    arr = np.asarray(gamma_codes, dtype=np.float64)
    single = False
    if arr.ndim == 1:
        arr = arr.reshape(1, 3)
        single = True

    linear = np.where(
        arr <= 0.04045,
        arr / 12.92,
        ((arr + 0.055) / 1.055) ** const.GAMMA
    )
    return linear[0] if single else linear


# ---------- LIGHTING CORRECTION ----------
def lighting_correction(captured_skin_linear, captured_reference_linear):
    if captured_skin_linear is None:
        return captured_skin_linear

    skin = np.atleast_2d(captured_skin_linear)
    ref = np.atleast_2d(captured_reference_linear) if captured_reference_linear is not None else None

    try:
        stored_ref = getattr(const, "REFERENCE_LINEAR_RGB", None)
        if ref is not None and stored_ref is not None and ref.shape[0] >= 3:
            # Solve ref @ M = stored_ref -> M is (3,3)
            M, _, _, _ = np.linalg.lstsq(ref, stored_ref, rcond=None)
            corrected = skin @ M
            corrected = np.clip(corrected, 0.0, 1.0)
            return corrected
    except Exception as e:
        print("lighting_correction: regression fallback due to:", e)

    if ref is not None and ref.shape[0] >= 1:
        neutral = ref[18:24] if ref.shape[0] >= 24 else ref
        ref_med = np.median(neutral, axis=0)
        skin_med = np.median(skin, axis=0)
        gain = ref_med / (skin_med + 1e-8)
        corrected = skin * gain
        corrected = np.clip(corrected, 0.0, 1.0)
        return corrected

    return skin


# ---------- LINEAR → XYZ ----------
def linear_to_xyz(linear_codes):
    arr = np.atleast_2d(linear_codes)
    xyz_T = const.RGB_TO_XYZ_MATRIX @ arr.T
    xyz = xyz_T.T
    return xyz


# ---------- XYZ → LAB ----------
X_ind = 0
Y_ind = 1
Z_ind = 2
def xyz_to_lab(xyz_codes):
    xyz = np.atleast_2d(xyz_codes).astype(np.float64)
    wp = np.array([const.REF_X, const.REF_Y, const.REF_Z], dtype=np.float64)
    xyz_norm = xyz / wp
    f = np.where(xyz_norm > const.EPSILON,
                 np.cbrt(xyz_norm),
                 (const.KAPPA * xyz_norm + 16.0) / 116.0)
    fx = f[:, X_ind]; fy = f[:, Y_ind]; fz = f[:, Z_ind]
    L = 116.0 * fy - 16.0
    a = 500.0 * (fx - fy)
    b = 200.0 * (fy - fz)
    return np.stack((L, a, b), axis=1) if xyz_codes.ndim > 1 else np.array([L[0], a[0], b[0]])


# ---------- ROBUST LAB AGGREGATION ----------
def median_lab(Lab_codes):
    arr = np.atleast_2d(Lab_codes)
    L_med = np.median(arr[:, 0])
    a_med = np.median(arr[:, 1])
    b_med = np.median(arr[:, 2])
    return np.array([L_med, a_med, b_med])
