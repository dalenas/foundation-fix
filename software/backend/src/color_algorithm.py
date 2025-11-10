from face_ref_scan import define_skin
from rgb_to_lab import gamma_to_linear, lighting_correction, linear_to_xyz, xyz_to_lab, average_lab
import numpy as np
from PIL import Image

def lab_avg_to_rgb(lab_avg):
    # Simple placeholder: convert Lab → RGB
    # You should implement proper conversion
    L, a, b = lab_avg
    # Approximate conversion for demo
    r = np.clip((L + a/2)/100, 0, 1)
    g = np.clip((L - a/2)/100, 0, 1)
    b = np.clip((L - b/2)/100, 0, 1)
    return r, g, b

def image_to_hex(image_path):
    img = Image.open(image_path).convert("RGB")
    img_np = np.array(img)[:, :, ::-1]  # PIL RGB → OpenCV BGR

    # Detect face and crop skin region
    skin_pixels = define_skin(img_np)

    # Flatten to Nx3 array and normalize
    skin_flat = skin_pixels.reshape(-1, 3) / 255.0

    # Convert to linear RGB, correct lighting
    linear_rgb = gamma_to_linear(skin_flat)
    corrected_rgb = lighting_correction(linear_rgb, linear_rgb)

    # Convert to XYZ → LAB → average
    xyz = linear_to_xyz(corrected_rgb)
    lab = xyz_to_lab(xyz)
    lab_avg = average_lab(lab)

    # Convert to RGB → hex
    r, g, b = lab_avg_to_rgb(lab_avg)
    hex_color = '#{:02X}{:02X}{:02X}'.format(int(r*255), int(g*255), int(b*255))
    return hex_color