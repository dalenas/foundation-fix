from flask import Flask, request, jsonify
from flask_cors import CORS
from color_algorithm import image_to_hex  # import your algorithm
from PIL import Image
import io
import tempfile
import os


app = Flask(__name__)
CORS(app)


@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "ok"}), 200

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]

        # Create a temp file without locking it
        tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
        tmp_path = tmp.name
        tmp.close()  # close it so we can write to it
        file.save(tmp_path)

        # Call your algorithm
        hex_color = image_to_hex(tmp_path)

        # Clean up the temp file
        os.remove(tmp_path)

        return jsonify({"result": hex_color})

    except Exception as e:
        print("🔥 Backend crashed with error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/dispense", methods=["POST"])
def dispense():
    data = request.get_json()
    color = data.get("color", None)
    if not color:
        return jsonify({"error": "No color provided"}), 400

    # Simulate dispense success
    return jsonify({"message": f"Dispensing {color}"}), 200

if __name__ == "__main__":
    app.run(host="tacobell.local", port=5173)
# A simple Mock Flask server with three endpoints: /ping, /analyze, and /dispense