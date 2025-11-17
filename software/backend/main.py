from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

# TODO: import your real face algorithm here
# from my_algo_module import get_foundation_color

app = Flask(__name__)
CORS(app)  # allow your React dev server to call this

@app.route("/ping", methods=["GET"])
def ping():
    """Health check for Device.tsx."""
    return jsonify({"status": "ok"}), 200


def run_algorithm(image: Image.Image) -> str:
    """
    CONNECT THIS TO YOUR REAL ALGO.
    Replace the body with whatever you already use to scan the face
    and decide the correct foundation.

    Example:
        return get_foundation_color(image)
    """
    # placeholder so the connection works:
    return "#C68A65"


@app.route("/analyze", methods=["POST"])
def analyze():
    """DEVICE → Analyze button hits this."""
    if "image" not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    file = request.files["image"]
    try:
        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        hex_color = run_algorithm(image)

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

    # TODO: hook this to your pumps / Pi hardware
    print(f"[DISPENSE] Dispensing for color: {color}")
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    # IMPORTANT: this URL/port must match Device.tsx BACKEND_URL
    app.run(host="172.20.10.2", port=8081, debug=True)