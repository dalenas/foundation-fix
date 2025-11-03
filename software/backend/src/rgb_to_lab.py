import numpy as np

from lib import constants as const

def gamma_to_rgb(gamma_codes):
    norm_rgb = gamma_codes / const.WHITEPOINT_D65
    linear_rgb = np.where(norm_rgb <= 0.04045,
                          norm_rgb / 12.92,
                          ((norm_rgb + 0.055) / 1.055) ** const.GAMMA)
    return linear_rgb