import numpy as np

from ..lib import constants as const
from ..src import rgb_to_lab as rtl
from ..src import face_ref_scan as scan


def test_gamma_to_linear():
    gamma_codes = const.REFERENCE_GAMMA_RGB
    expected_linear_rgb = const.REFERENCE_LINEAR_RGB
    computed_linear_rgb = rtl.gamma_to_linear(gamma_codes)
    assert np.allclose(computed_linear_rgb, expected_linear_rgb, atol=1e-5)
    print("test_gamma_to_linear passed")


def run_live_capture_pipeline():
   
    result = scan.get_face_codes()
    if result is None:
        print("get_face_codes() returned None")
        return

    skin_rgb, ref_rgb = result

    if skin_rgb is None or ref_rgb is None or skin_rgb.size == 0 or ref_rgb.size == 0:
        print("Failed to capture valid skin or reference RGB codes.")
        return

    print("\nSkin RGB samples shape:", skin_rgb.shape)
    print("Reference (Macbeth) RGB samples shape:", ref_rgb.shape)

    skin_gamma = skin_rgb.astype(np.float32)
    ref_gamma = ref_rgb.astype(np.float32)

    linear_skin = rtl.gamma_to_linear(skin_gamma)
    linear_reference = rtl.gamma_to_linear(ref_gamma)

    light_corrected = rtl.lighting_correction(linear_reference, linear_skin)

    xyz_codes = rtl.linear_to_xyz(light_corrected)

    lab_codes = rtl.xyz_to_lab(xyz_codes)

    final_code = rtl.average_lab(lab_codes)

    print("\nFinal averaged Lab code from live capture:", final_code)


if __name__ == "__main__":
    test_gamma_to_linear()

    run_live_capture_pipeline()
