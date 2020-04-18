from flask import Blueprint, request
from random import choice

api = Blueprint('api', __name__)

from .detection import predict

@api.route('/', methods=['GET'])
def status():
    return {"hello":"world"}, 200

@api.route('/check', methods=['POST'])
def check():
    text = request.json.get("text", "")
    return {"text": text, "toxic": int(predict([text])[0])}
