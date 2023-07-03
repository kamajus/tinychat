from flask import Blueprint
from flask_socketio import SocketIO
from db import db, console

from datetime import datetime

sockets = Blueprint('sockets', __name__)
sio = SocketIO()

@sio.on('connect')
def on_connected():
    console.log('[bold green]USER CONNECTED[/]')
    
@sio.on('disconnect')
def on_disconnected():
    console.log('[bold red]USER DISCONNECTED[/]')

@sio.on('message')
def on_message(data):
    users = [data['from'], data['to']]
    
    if not db.chats.find_one({"users": {"$all":users}}):
        db.chats.insert_one({
            "users": [data['from'], data['to']],
            "created_at": datetime.now().isoformat()
    })
        
    db.chats.update_one(
        {
            "users": {"$all": [data['from'], data['to']]}
        },
        {
            "$push": {
                "messages": {
                    "from": data["from"],
                    "to": data["to"],
                    "content": data["content"],
                    "created_at": datetime.now().isoformat()
                }
            }
        }
    )

    sio.emit('message', {
        "from": data["from"],
        "to": data["to"],
        "content": data["content"],
        "created_at": datetime.now().isoformat()
    })
    
    
@sio.on('typing')
def on_typing(data):
    sio.emit('typing', {
        "from": data["from"],
        "to": data["to"],
    })