import numpy as np

from src import rgb_to_lab as rtl

reference = np.array([
    [14, 12, 10],
    [28, 22, 19],
    [18, 20, 19],
    [13, 14, 10],
    [21, 24, 21],
    [24, 29, 26],

    [23, 16, 11],
    [10, 12, 12],
    [25, 15, 14],
    [13, 13, 11],
    [19, 21, 11],
    [31, 25, 14],

    [10, 10, 10],
    [12, 15, 10],
    [21, 9, 8],
    [33, 25, 11],
    [26, 17, 16],
    [16, 18, 17],

    [32, 31, 23],
    [27, 28, 23],
    [12, 12, 10],
    [16, 16, 14],
    [13, 12, 11],
    [12, 12, 10]
])

skin = np.array([
    [18, 11, 9],
    [21, 15, 12],
    [24, 15, 12],
    [20, 14, 12],
    [21, 14, 14],
    [23, 15, 14],
    [19, 10, 8],
    [21, 16, 14],
    [20, 15, 12],
    [20, 13, 11]
])

linear_skin = rtl.gamma_to_linear(skin)
linear_reference = rtl.gamma_to_linear(reference)
light_corrected = rtl.lighting_correction(linear_reference, linear_skin)
xyz_codes = rtl.linear_to_xyz(light_corrected)
lab_codes = rtl.xyz_to_lab(xyz_codes)
final_code = rtl.average_lab(lab_codes)
print(final_code)