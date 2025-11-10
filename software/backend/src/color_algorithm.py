from face_ref_scan import define_skin
from rgb_to_lab import gamma_to_linear, lighting_correction, linear_to_xyz, xyz_to_lab, average_lab
import numpy as np
from PIL import Image