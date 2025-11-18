import sys
import os

module_directory = os.path.abspath("../src/")
sys.path.insert(0, module_directory)

import numpy as np

import rgb_to_lab as rtl
import lab_to_mix as ltm

reference_gamma = np.array([[124, 90, 73],
                            [177, 145, 126],
                            [103, 135, 156],
                            [112, 124, 95],
                            [133, 141, 164],
                            [106, 168, 152],

                            [171, 110, 77],
                            [67, 99, 133],
                            [169, 97, 92],
                            [98, 78, 98],
                            [142, 152, 94],
                            [193, 147, 93],

                            [53, 79, 104],
                            [78, 118, 79],
                            [150, 68, 68],
                            [185, 151, 88],
                            [166, 84, 109],
                            [68, 127, 154],

                            [176, 171, 159],
                            [157, 153, 145],
                            [103, 98, 93],
                            [111, 105, 97],
                            [95, 91, 83],
                            [88, 84, 76]])
skin_gamma = np.array([[190, 139, 116],
                    [166, 120, 99],
                    [167, 121, 100],
                    [187, 136, 114],
                    [170, 124, 103],
                    [186, 138, 116],
                    [155, 110, 91],
                    [183, 135, 114],
                    [168, 122, 101],
                    [178, 132, 112]])

reference_linear = rtl.gamma_to_linear(reference_gamma)
skin_linear = rtl.gamma_to_linear(skin_gamma)
skin_corrected = rtl.lighting_correction(reference_linear, skin_linear)
xyz_codes = rtl.linear_to_xyz(skin_corrected)
lab_codes = rtl.xyz_to_lab(xyz_codes)
lab_avg = rtl.average_lab(lab_codes)
print(lab_avg)

mix_prop = ltm.calculate_proportions(lab_avg)
print(mix_prop)