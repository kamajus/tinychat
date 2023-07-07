from flask import Blueprint
from flask_socketio import SocketIO
from flask_pydantic import validate
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
    
@sio.on('ping')
@validate()
def tick_pong(data):
    db.users.update_one({"email": str(data["user"])}, {
        "$set": {"last_stay": datetime.now().isoformat()}
    })
    
    console.log('🎾⚡️ Ping! ⚡️🎾')
    
    sio.emit('pong', {"email": str(data["user"]), "last_stay": datetime.now().isoformat()}) 
        
@sio.on('message')
@validate()
def on_message(data):
    if not db.chats.find_one({"users": {"$all":[data['from'], data['to']]}}):
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
                },
                "update_at": datetime.now().isoformat()
            }
        }
    )
    
    user_from = db.users.find_one({"email": data["from"]}) # Processando...
    user_from['_id'] = str(user_from['_id'])
    
    user_to = db.users.find_one({"email": data["to"]}) # Processando...
    user_to['_id'] = str(user_to['_id'])

    sio.emit('message', {
        "messages": {
            "from": user_from,
            "to": user_to,
            "content": data["content"],
            "created_at": datetime.now().isoformat()
        }, "users": [user_from, user_to]
    })
    
    
@sio.on('typing')
@validate()
def typing_message(data):
    sio.emit('typing', {
        "from": data["from"],
        "to": data["to"]
    })
    
    
@sio.on('un-typing')
@validate()
def un_typing(data):
    sio.emit('un-typing', {
        "from": data["from"],
        "to": data["to"]
    })
    
    
    
