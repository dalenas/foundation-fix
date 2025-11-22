import sys
import os

module_directory = os.path.abspath("../src/")
sys.path.insert(0, module_directory)

import rgb_to_lab as rgb2lab
import numpy as np

skin_0 = 