import numpy as np

from lib import constants as const

def gamma_to_linear(gamma_codes):
    norm_rgb = gamma_codes / const.WHITEPOINT_D65
    linear_rgb = np.where(norm_rgb <= 0.04045,
                          norm_rgb / 12.92,
                          ((norm_rgb + 0.055) / 1.055) ** const.GAMMA)
    return linear_rgb

def lighting_correction(captured_reference, captured_skin):
    stored_reference_pinv = np.lingalg.pinv(const.REFERENCE_LINEAR_RGB)
    lighting_matrix = stored_reference_pinv @ captured_reference
    lighting_matrix_inv = np.lingalg.inv(lighting_matrix)
    lighting_corrected_skin = captured_skin @ lighting_matrix_inv
    return lighting_corrected_skin

# xyz_codes = RGB_TO_XYZ_MATRIX @ lighting_corrected_skin
# [3 x 1] = [3 x 3] x [3 x 1]
def linear_to_xyz(linear_codes):
    linear_codes_T = np.transpose(linear_codes)
    xyz_codes_T = const.RGB_TO_XYZ_MATRIX @ linear_codes_T
    xyz_codes = np.transpose(xyz_codes_T)
    return xyz_codes

def xyz_to_lab():
