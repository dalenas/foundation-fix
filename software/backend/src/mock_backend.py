from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "ok"}), 200

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    image = data.get("image", None)
    if not image:
        return jsonify({"error": "No image provided"}), 400

    # Return a fake hex color
    return jsonify({"result": "#F0C1A0"}), 200

@app.route("/dispense", methods=["POST"])
def dispense():
    data = request.get_json()
    color = data.get("color", None)
    if not color:
        return jsonify({"error": "No color provided"}), 400

    # Simulate dispense success
    return jsonify({"message": f"Dispensing {color}"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
# A simple Mock Flask server with three endpoints: /ping, /analyze, and /dispense