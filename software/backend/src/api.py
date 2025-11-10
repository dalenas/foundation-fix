# INTEGRATION STEP
# This is intended to be an event handler that helps communicate between UI and backend

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/data', methods=['POST'])
def handle_data():
    data = request.get_json()

    image_base64 = data.get("image")  # the base64 image string from frontend

    # run your algorithm that returns hex color
    hex_color = your_color_algorithm.get_hex_color(image_base64)

    return jsonify({
        "result": hex_color
    })
