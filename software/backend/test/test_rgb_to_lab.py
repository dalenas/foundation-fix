import numpy as np

from lib import constants as const
from src import rgb_to_lab as rtl

def test_gamma_to_linear():
    gamma_codes = const.REFERENCE_GAMMA_RGB
    expected_linear_rgb = const.REFERENCE_LINEAR_RGB
    computed_linear_rgb = rtl.gamma_to_linear(gamma_codes)
    assert np.allclose(computed_linear_rgb, expected_linear_rgb, atol=1e-5)
    print("test_gamma_to_linear passed")

gamma_codes = np.array([
    [190, 139, 118],
    [170, 123, 102],
    [168, 122, 101],
    [180, 131, 111],
    [180, 134, 113],
    [192, 140, 119],
    [169, 124, 102],
    [184, 136, 114],
    [187, 138, 116],
    [167, 121, 100]])
captured_reference = np.array([
    [120, 92, 79],   # 1 Dark Skin
    [169, 144, 126], # 2 Light Skin
    [104, 130, 148],  # 3 Blue Sky
    [111, 121, 95],   # 4 Foliage
    [134, 142, 161], # 5 Blue Flower
    [122, 168, 154], # 6 Bluish Green
    [164, 115, 86],  # 7 Orange
    [76, 101, 132],   # 8 Purplish Blue
    [156, 95, 89],  # 9 Moderate Red
    [98, 81, 98],   # 10 Yellow Green
    [146, 155, 102],  # 11 Blue
    [187, 150, 101],  # 12 Green
    [64, 82, 107],   # 13 Red
    [84, 114, 84],   # 14 Yellow
    [142, 74, 69],   # 15 Magenta
    [180, 153, 98],  # 16 Cyan
    [157, 90, 110],  # 17 Gray scale row
    [88, 129, 153],
    [179, 174, 164],
    [159, 156, 147],
    [94, 91, 86],
    [110, 105, 99],
    [98, 93, 89],
    [89, 86, 80]])
linear_skin = rtl.gamma_to_linear(gamma_codes)
linear_reference = rtl.gamma_to_linear(captured_reference)
light_corrected = rtl.lighting_correction(linear_reference, linear_skin)
xyz_codes = rtl.linear_to_xyz(light_corrected)
Lab_codes = rtl.xyz_to_lab(xyz_codes)
final_code = rtl.average_lab(Lab_codes)
print(final_code)