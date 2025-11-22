"""from flask import Flask, request, jsonify
from color_algorithm import image_to_hex
from PIL import Image
import base64
from io import BytesIO

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    image_base64 = data.get("image")

    if not image_base64:
        return jsonify({"error": "No image provided"}), 400

    # Strip Base64 header if present
    if image_base64.startswith("data:image"):
        image_base64 = image_base64.split(",")[1]

    # Decode and load as image
    image_bytes = base64.b64decode(image_base64)
    img = Image.open(BytesIO(image_bytes))
    img.save("temp_image.png")  # temporary file for processing

    try:
        hex_color = image_to_hex("temp_image.png")
        return jsonify({"result": hex_color})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/dispense', methods=['POST'])
def dispense():
    data = request.get_json()
    color = data.get("color")
    if not color:
        return {"error": "No color provided"}, 400

    # TODO: add your Pi dispensing code here
    print(f"Dispensing foundation for color {color}")
    # Example: trigger GPIO pins or send command to dispenser
    return {"status": "dispensing started", "color": color}

@app.route("/ping", methods=["GET"])
def ping():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
"""