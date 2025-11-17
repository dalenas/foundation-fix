import numpy as np

from lib import constants as const

def simplex_projection(prop_0):
    prop_sort = np.sort(prop_0)[::-1]
    sort_cumsum = np.cumsum(prop_sort)
    rho = np.nonzero(prop_sort * np.arange(1, prop_sort.size + 1) > (sort_cumsum - 1))[0]
    if rho.size == 0:
        theta = 0
    else:
        rho = rho[-1]
        theta = (sort_cumsum[rho] - 1.0) / (rho + 1.0)
    prop = np.maximum(prop_0 - theta, 0.0)
    return prop

def proportion_calculation(lab_code):
    BBt = const.BASE_LABS.dot(const.BASE_LABS.T)
    Bt = const.BASE_LABS.dot(lab_code)
    eps = 1e-8
    try:
        prop_0 = np.linalg.solve(BBt + eps * np.eye(BBt.shape[0]), Bt)
    except np.linalg.LinAlgError:
        prop_0 = np.linalg.lstsq(BBt + eps * np.eye(BBt.shape[0]), Bt, rcond=None)[0]
    prop = simplex_projection(prop_0)
    return prop

print(proportion_calculation(np.array([62.0, 12.0, 22.0])))