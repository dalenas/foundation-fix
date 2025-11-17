'''import numpy as np

from lib import constants as const

def project_to_simplex(prop_0):
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

def lab_to_gamma_lab(lab_code):
    L, a, b = lab_code
    Lp = (L / 100)**const.GAMMA
    ap = a / 128
    bp = b / 128
    return np.array([Lp, ap, bp])

def gamma_lab_to_lab(gamma_lab):
    Lp, ap, bp = gamma_lab
    L = Lp**(1 / const.GAMMA) * 100
    a = ap * 128
    b = bp * 128
    return np.array([L, a, b])

def linear_proportion_calculation(lab_bases, lab_code):
    lab_bases = np.asarray(lab_bases, dtype=float)   # shape (5,3)
    lab_code = np.asarray(lab_code, dtype=float)
    BBt = lab_bases.dot(lab_bases.T)
    Bt = lab_bases.dot(lab_code)
    eps = 1e-8
    try:
        prop_0 = np.linalg.solve(BBt + eps * np.eye(BBt.shape[0]), Bt)
    except np.linalg.LinAlgError:
        prop_0 = np.linalg.lstsq(BBt + eps * np.eye(BBt.shape[0]), Bt, rcond=None)[0]
    prop = project_to_simplex(prop_0)
    return prop

def nonlinear_proportion_calculation(lab_bases, gamma_lab):
    bases_prime = np.array([lab_to_gamma_lab(code) for code in lab_bases])
    lab_prime = lab_to_gamma_lab(gamma_lab)
    prop = linear_proportion_calculation(bases_prime, lab_prime)
    return prop'''

#print(nonlinear_proportion_calculation(const.BASE_LABS, np.array([20, 10, 15])))
#print(linear_proportion_calculation(const.BASE_LABS, np.array([62.0, 12.0, 22.0])))

import numpy as np

def project_to_simplex(v):
    """Project vector v onto the probability simplex {w: w>=0, sum(w)=1}.
    Implementation based on (Duchi et al. 2008)."""
    v = np.asarray(v, dtype=float)
    n = v.size
    if n == 0:
        return v
    # sort descending
    u = np.sort(v)[::-1]
    cssv = np.cumsum(u)
    rho = np.nonzero(u * np.arange(1, n+1) > (cssv - 1))[0]
    if rho.size == 0:
        theta = 0
    else:
        rho = rho[-1]
        theta = (cssv[rho] - 1.0) / (rho + 1.0)
    w = np.maximum(v - theta, 0.0)
    return w

def lab_linear_mix_proportions(base_labs, target_lab):
    """
    base_labs: (5,3) array of Lab rows for bases (order: white, black, red, blue, yellow, or your order)
    target_lab: length-3 array [L,a,b]
    returns: proportions w (sum=1, nonneg)
    """
    B = np.asarray(base_labs, dtype=float)   # shape (5,3)
    t = np.asarray(target_lab, dtype=float)  # shape (3,)
    # Solve small linear system: minimize ||B^T w - t||^2
    # Equivalent to (B B^T) w = B t
    BBt = B.dot(B.T)      # 5x5
    Bt = B.dot(t)         # 5
    # regularize a tiny bit in case BBt is near-singular
    eps = 1e-8
    try:
        w_raw = np.linalg.solve(BBt + eps * np.eye(BBt.shape[0]), Bt)
    except np.linalg.LinAlgError:
        w_raw = np.linalg.lstsq(BBt + eps * np.eye(BBt.shape[0]), Bt, rcond=None)[0]
    # now project onto simplex to enforce nonnegativity and sum=1
    w = project_to_simplex(w_raw)
    return w

if __name__ == "__main__":
    # Replace these with your base Lab triples (order must match what you expect)
    base_labs = np.array([
        [98.5,  0.4,   1.2],   # White
        [ 6.2,  0.0,   0.0],   # Black
        [45.0, 55.0,  20.0],   # Red
        [35.0, 10.0, -45.0],   # Blue
        [85.0, -5.0,  80.0],   # Yellow
    ])
    target_lab = np.array([62.0, 12.0, 22.0])
    w = lab_linear_mix_proportions(base_labs, target_lab)
    print("Proportions (sum):", w, np.sum(w))

    # Convert to dispenser steps (825 total)
    total_steps = 825
    raw_steps = total_steps * w
    int_steps = np.round(raw_steps).astype(int)
    # adjust rounding so sum == total_steps
    diff = total_steps - int_steps.sum()
    if diff != 0:
        # shift the largest-proportion index by the diff
        idx = int(np.argmax(w))
        int_steps[idx] += diff
    print("Integer steps:", int_steps)
    print("Steps sum:", int_steps.sum())