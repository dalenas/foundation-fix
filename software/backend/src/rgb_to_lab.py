import numpy as np

from src.lib import constants as const

def gamma_to_linear(gamma_codes):
    norm_rgb = gamma_codes / const.WHITEPOINT_D65
    linear_rgb = np.where(norm_rgb <= 0.04045,
                          norm_rgb / 12.92,
                          ((norm_rgb + 0.055) / 1.055) ** const.GAMMA)
    return linear_rgb

def lighting_correction(captured_reference, captured_skin):
    stored_reference_pinv = np.linalg.pinv(const.REFERENCE_LINEAR_RGB)
    lighting_matrix = stored_reference_pinv @ captured_reference
    lighting_matrix_inv = np.linalg.inv(lighting_matrix)
    lighting_corrected_skin = captured_skin @ lighting_matrix_inv
    return lighting_corrected_skin

def linear_to_xyz(linear_codes):
    linear_codes_T = np.transpose(linear_codes)
    xyz_codes_T = const.RGB_TO_XYZ_MATRIX @ linear_codes_T
    xyz_codes = np.transpose(xyz_codes_T)
    return xyz_codes

X_ind = 0
Y_ind = 1
Z_ind = 2
def xyz_to_lab(xyz_codes):
    f_sub_xyz = np.where(xyz_codes > const.EPSILON,
                         np.cbrt(xyz_codes),
                         (const.KAPPA * xyz_codes + 16) / 116)
    f_sub_x = f_sub_xyz[:, X_ind]
    f_sub_y = f_sub_xyz[:, Y_ind]
    f_sub_z = f_sub_xyz[:, Z_ind]
    L = 116 * f_sub_y - 16
    a = 500 * (f_sub_x - f_sub_y)
    b = 200 * (f_sub_y - f_sub_z)
    Lab_codes = np.stack((L, a, b), axis = 1)
    return Lab_codes

L_ind = 0
a_ind = 1
b_ind = 2
def average_lab(Lab_codes):
    L_avg = np.mean(Lab_codes[:, L_ind])
    a_avg = np.mean(Lab_codes[:, a_ind])
    b_avg = np.mean(Lab_codes[:, b_ind])
    return np.array([L_avg, a_avg, b_avg])