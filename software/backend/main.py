from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tempfile
import lgpio
import time
import os

from src import rgb_to_lab as rgb2lab
from src import dispenser as disp
from src import face_ref_scan_static as frs
from src.color_algorithm import image_to_hex

app = Flask(__name__)
CORS(app)

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "ok"}), 200

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

        # USE NEW COLOR ALGORITHM
        from src.color_algorithm import image_to_hex
        hex_color = image_to_hex(temp_path, debug=False)

        os.remove(temp_path)
        return jsonify({"hex": hex_color}), 200
    
    except Exception as e:
        print("Test analyze error:", e)

    return jsonify({"error": "Failed to analyze image."}), 500

@app.route("/dispense", methods=["POST"])
def dispense():
    try:
        lab = request.get_json()

        if not lab or "lab" not in lab:
            return jsonify({"error": "No LAB array provided."}), 400

        lab_code = np.array(lab["lab"], dtype=float)

        DELAY = 5
        chip = lgpio.gpiochip_open(0)
        steps = disp.calculate_steps(lab_code)
        disp.dispense_foundation(disp.WHITE_MOTOR_PINS, disp.WHITE_SWITCH_PIN, int(steps[disp.WHITE_IND]), chip)
        time.sleep(DELAY)
        disp.dispense_foundation(disp.BLACK_MOTOR_PINS, disp.BLACK_SWITCH_PIN, int(steps[disp.BLACK_IND]), chip)
        time.sleep(DELAY)
        disp.dispense_foundation(disp.RED_MOTOR_PINS, disp.RED_SWITCH_PIN, int(steps[disp.RED_IND]), chip)
        time.sleep(DELAY)
        disp.dispense_foundation(disp.BLUE_MOTOR_PINS, disp.BLUE_SWITCH_PIN, int(steps[disp.BLUE_IND]), chip)
        time.sleep(DELAY)
        disp.dispense_foundation(disp.YELLOW_MOTOR_PINS, disp.YELLOW_SWITCH_PIN, int(steps[disp.YELLOW_IND]), chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Dispense error:", e)
        return jsonify({"error": "Dispense failed."}), 500

@app.route("/killMotors", methods=["POST"])
def killMotors():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.disable_motors(disp.WHITE_MOTOR_PINS, chip)
        disp.disable_motors(disp.BLACK_MOTOR_PINS, chip)
        disp.disable_motors(disp.RED_MOTOR_PINS, chip)
        disp.disable_motors(disp.BLUE_MOTOR_PINS, chip)
        disp.disable_motors(disp.YELLOW_MOTOR_PINS, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Motor error:", e)
        return jsonify({"error": "Motor error."}), 500

@app.route("/extractWhite", methods=["POST"])
def extractWhite():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.WHITE_MOTOR_PINS, 4096, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractBlack", methods=["POST"])
def extractBlack():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.BLACK_MOTOR_PINS, 4096, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractRed", methods=["POST"])
def extractRed():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.RED_MOTOR_PINS, 4096, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractBlue", methods=["POST"])
def extractBlue():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.BLUE_MOTOR_PINS, 4096, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractYellow", methods=["POST"])
def extractYellow():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.YELLOW_MOTOR_PINS, 4096, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractWhiteHalf", methods=["POST"])
def extractWhiteHalf():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.WHITE_MOTOR_PINS, 2048, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractBlackHalf", methods=["POST"])
def extractBlackHalf():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.BLACK_MOTOR_PINS, 2048, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractRedHalf", methods=["POST"])
def extractRedHalf():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.RED_MOTOR_PINS, 2048, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractBlueHalf", methods=["POST"])
def extractBlueHalf():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.BLUE_MOTOR_PINS, 2048, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractYellowHalf", methods=["POST"])
def extractYellowHalf():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.YELLOW_MOTOR_PINS, 2048, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractWhiteQuarter", methods=["POST"])
def extractWhiteQuarter():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.WHITE_MOTOR_PINS, 1024, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractBlackQuarter", methods=["POST"])
def extractBlackQuarter():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.BLACK_MOTOR_PINS, 1024, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractRedQuarter", methods=["POST"])
def extractRedQuarter():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.RED_MOTOR_PINS, 1024, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractBlueQuarter", methods=["POST"])
def extractBlueQuarter():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.BLUE_MOTOR_PINS, 1024, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractYellowQuarter", methods=["POST"])
def extractYellowQuarter():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.YELLOW_MOTOR_PINS, 1024, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractWhiteEighth", methods=["POST"])
def extractWhiteEighth():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.WHITE_MOTOR_PINS, 512, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractBlackEighth", methods=["POST"])
def extractBlackEighth():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.BLACK_MOTOR_PINS, 512, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractRedEighth", methods=["POST"])
def extractRedEighth():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.RED_MOTOR_PINS, 512, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractBlueEighth", methods=["POST"])
def extractBlueEighth():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.BLUE_MOTOR_PINS, 512, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/extractYellowEighth", methods=["POST"])
def extractYellowEighth():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.extract_foundation(disp.YELLOW_MOTOR_PINS, 512, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Extract error:", e)
        return jsonify({"error": "Extract failed."}), 500

@app.route("/emptyWhite", methods=["POST"])
def emptyWhite():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.dispense_foundation(disp.WHITE_MOTOR_PINS, disp.WHITE_SWITCH_PIN, 8192, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Empty error:", e)
        return jsonify({"error": "Empty failed."}), 500

@app.route("/emptyBlack", methods=["POST"])
def emptyBlack():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.dispense_foundation(disp.BLACK_MOTOR_PINS, disp.BLACK_SWITCH_PIN, 8192, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Empty error:", e)
        return jsonify({"error": "Empty failed."}), 500

@app.route("/emptyRed", methods=["POST"])
def emptyRed():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.dispense_foundation(disp.RED_MOTOR_PINS, disp.RED_SWITCH_PIN, 8192, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Empty error:", e)
        return jsonify({"error": "Empty failed."}), 500

@app.route("/emptyBlue", methods=["POST"])
def emptyBlue():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.dispense_foundation(disp.BLUE_MOTOR_PINS, disp.BLUE_SWITCH_PIN, 8192, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Empty error:", e)
        return jsonify({"error": "Empty failed."}), 500

@app.route("/emptyYellow", methods=["POST"])
def emptyYellow():
    try:
        chip = lgpio.gpiochip_open(0)
        disp.dispense_foundation(disp.YELLOW_MOTOR_PINS, disp.YELLOW_SWITCH_PIN, 8192, chip)
        lgpio.gpiochip_close(chip)

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("Empty error:", e)
        return jsonify({"error": "Empty failed."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)