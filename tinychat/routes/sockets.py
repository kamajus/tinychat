from datetime import datetime

from db import console, db
from engineio.payload import Payload
from flask import Blueprint
from flask_pydantic import validate
from flask_socketio import SocketIO
from models import UsersList
from pydantic import validate_email

sockets = Blueprint("sockets", __name__)
sio = SocketIO()

Payload.max_decode_packets = 50


@sio.on("connect")
def on_connected():
    console.log("[bold green]USER CONNECTED[/]")


@sio.on("disconnect")
def on_disconnected():
    console.log("[bold red]USER DISCONNECTED[/]")


@sio.on("ping")
@validate()
def tick_pong(data):
    validate_email(str(data["user"]))

    db.users.update_one(
        {"email": str(data["user"])},
        {"$set": {"last_stay": datetime.now().isoformat()}},
    )

    sio.emit(
        "pong", {"email": str(data["user"]), "last_stay": datetime.now().isoformat()}
    )


@sio.on("message")
@validate()
def on_message(data):
    UsersList(users=[data["from_email"], data["to_email"]])
    if not db.chats.find_one(
        {"users": {"$all": [data["from_email"], data["to_email"]]}}
    ):
        db.chats.insert_one(
            {
                "users": [data["from_email"], data["to_email"]],
                "created_at": datetime.now().isoformat(),
            }
        )

    db.chats.update_one(
        {"users": {"$all": [data["from_email"], data["to_email"]]}},
        {
            "$push": {
                "messages": {
                    "from_email": data["from_email"],
                    "to_email": data["to_email"],
                    "content": data["content"],
                    "created_at": datetime.now().isoformat(),
                    "was_readed": False,
                },
                "update_at": datetime.now().isoformat(),
            }
        },
    )

    # Processing...
    user_from = db.users.find_one({"email": data["from_email"]})
    user_from["_id"] = str(user_from["_id"])

    user_to = db.users.find_one({"email": data["to_email"]})  # Processing...
    user_to["_id"] = str(user_to["_id"])

    sio.emit(
        "message",
        {
            "messages": {
                "from_email": user_from,
                "to_email": user_to,
                "content": data["content"],
                "created_at": datetime.now().isoformat(),
                "was_readed": False,
            },
            "users": [user_from, user_to],
        },
    )


@sio.on("typing")
@validate()
def typing_message(data):
    UsersList(users=[data["from_email"], data["to_email"]])
    sio.emit("typing", {"from_email": data["from_email"], "to_email": data["to_email"]})


@sio.on("un-typing")
@validate()
def un_typing(data):
    UsersList(users=[data["from_email"], data["to_email"]])
    sio.emit(
        "un-typing", {"from_email": data["from_email"], "to_email": data["to_email"]}
    )
