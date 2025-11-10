# INTEGRATION STEP
# This is intended to be an event handler that helps communicate between UI and backend

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/data', methods=['POST'])
def handle_data():
    return
