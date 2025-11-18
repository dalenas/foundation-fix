import sys
import os

module_directory = os.path.abspath("../src/")
sys.path.insert(0, module_directory)

import numpy as np

import rgb_to_lab as rtl
import lab_to_mix as ltm

skin_gamma = np.array([[103,59,41]])

skin_linear = rtl.gamma_to_linear(skin_gamma)
xyz_codes = rtl.linear_to_xyz(skin_linear)
lab_codes = rtl.xyz_to_lab(xyz_codes)
print(lab_codes)