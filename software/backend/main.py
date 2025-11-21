from flask import Flask, request, jsonify
import tempfile
import os

from src import rgb_to_lab as rgb2lab
from src import dispenser as disp

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided."}), 400
    file = request.files["image"]
    try:
        img_bytes = file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(img_bytes)
            temp_path = tmp.name
        
        # IMAGE PROCESSING AND COLOR ALGORITHM HERE
            # IMAGE PROCESSING HERE

            # COLOR ALGORITHM HERE
        skin_linear = rgb2lab.gamma_to_Linear(skin_gamma)
        reference_linear = rgb2lab.gamma_to_linear(reference_gamma)

        skin_corrected = rgb2lab.lighting_correction(skin_linear, reference_linear)

        skin_xyz = rgb2lab.linear_to_xyz(skin_corrected)
        skin_lab = rgb2lab.xyz_to_lab(skin_xyz)

        lab_code = rgb2lab.median_lab(skin_lab)
        
        os.remove(temp_path)
        return jsonify({"result": lab_code}), 200
    
    except Exception as e:
        print("Test analyze error:", e)
        return jsonify({"error": "Failed to analyze image."}), 500

@app.route("/dispense", methods=["POST"])
def dispense():
    try:
        lab = request.get_json()

        if not data or "lab" not in data:
            return jsonify({"error": "No LAB array provided."}), 400

        lab_code = np.array(lab["lab"], dtype=float)

        steps = disp.calculate_steps(lab_code)
        disp.dispense_foundation(disp.WHITE_MOTOR_PINS, disp.WHITE_SWITCH_PIN, steps[disp.WHITE_IND])
        disp.dispense_foundation(disp.BLACK_MOTOR_PINS, disp.BLACK_SWITCH_PIN, steps[disp.BLACK_IND])
        disp.dispense_foundation(disp.RED_MOTOR_PINS, disp.RED_SWITCH_PIN, steps[disp.RED_IND])
        disp.dispense_foundation(disp.BLUE_MOTOR_PINS, disp.BLUE_SWITCH_PIN, steps[disp.BLUE_IND])
        disp.dispense_foundation(disp.YELLOW_MOTOR_PINS, disp.YELLOW_SWITCH_PIN, steps[disp.YELLOW_IND])
        lgpio.gpiochip_close(disp.CHIP)

            return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Dispense error:", e)
        return jsonify({"error": "Dispense failed."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
