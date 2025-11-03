import numpy as np

from lib import constants as const
from src import rgb_to_lab as rtl

def test_gamma_to_rgb():
    gamma_codes = const.REFERENCE_GAMMA_RGB
    expected_linear_rgb = const.REFERENCE_LINEAR_RGB
    computed_linear_rgb = rtl.gamma_to_rgb(gamma_codes)
    assert np.allclose(computed_linear_rgb, expected_linear_rgb, atol=1e-5)
    print("test_gamma_to_rgb passed")

test_gamma_to_rgb()