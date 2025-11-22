from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import tempfile
import os
from src.color_algorithm import image_to_hex

app = Flask(__name__)
CORS(app)


@app.route("/ping", methods=["GET"])
def ping():
    """Health check for Device.tsx."""
    return jsonify({"status": "ok"}), 200


@app.route("/analyze", methods=["POST"])
def analyze():
    """DEVICE → Analyze button hits this."""
    if "image" not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    file = request.files["image"]

    try:
        # Save incoming image temporarily because image_to_hex expects a path
        img_bytes = file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(img_bytes)
            temp_path = tmp.name

        # Run your new algorithm
        hex_color = image_to_hex(temp_path)

        # Cleanup temp file
        os.remove(temp_path)

        return jsonify({"result": hex_color}), 200

    except Exception as e:
        print("Analyze error:", e)
        return jsonify({"error": "Failed to analyze image."}), 500


@app.route("/dispense", methods=["POST"])
def dispense():
    """Optional: Device's 'Dispense Foundation' button hits this."""
    data = request.get_json(silent=True) or {}
    color = data.get("color")

    if not color:
        return jsonify({"error": "No color provided."}), 400

    
    
    print(f"[DISPENSE] Dispensing for color: {color}")
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)