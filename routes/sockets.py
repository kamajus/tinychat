from flask import Blueprint
from flask_socketio import SocketIO

sockets = Blueprint('sockets', __name__)
sio = SocketIO()

@sio.on('connect')
def on_connected():
    print('\33[42mCONNECTED\33[m')
    
@sio.on('disconnect')
def on_disconnected():
    print('\33[41mDISCONNECTED\33[m')

@sio.on('message')
def on_message(data):
    sio.emit('message', {
        "from": data["from"],
        "to": data["to"],
        "content": data["content"]
    })