from datetime import datetime
from os import getenv

import pymongo
from db import db
from dotenv import load_dotenv
from flask import Blueprint, jsonify, request
from flask_pydantic import validate
from models import UserModel, UsersList
from pydantic import validate_email

index = Blueprint("index", __name__)
load_dotenv()


@index.get("/secrets")
def secrets():
    return (
        jsonify(
            {
                "firebaseConfig": {
                    "apiKey": getenv("FIREBASE_API_KEY"),
                    "authDomain": getenv("FIREBASE_AUTH_DOMAIN"),
                    "projectId": getenv("FIREBASE_PROJECT_ID"),
                    "storageBucket": getenv("FIREBASE_STORAGE_BUCKET"),
                    "messagingSenderId": getenv("FIREBASE_MESSAGING_SENDER_ID"),
                    "appId": getenv("FIREBASE_APP_ID"),
                }
            }
        ),
        200,
    )


@index.post("/login")
@validate()
def login():
    user = {
        "name": request.json["name"],
        "email": request.json["email"],
        "photoURL": request.json["photoURL"],
        "last_stay": datetime.now().isoformat(),
    }

    UserModel(**user)

    userExists = db.users.find_one({"email": user["email"]})

    if userExists:
        userExists["_id"] = str(userExists["_id"])
        return userExists
    else:
        user_id = db.users.insert_one(user).inserted_id
        user["_id"] = str(user_id)

        return user, 201


@index.get("/search/<search>")
def get_users(search: str):
    users = list(db.users.find({"email": {"$regex": search}}))
    users_ = []

    for user in users:
        user["_id"] = str(user["_id"])
        users_.append(user)

    return (users_, 200) if users_ else ([], 200)


@index.put("/read_messages")
@validate()
def read_messages():
    UsersList(users=request.json["users"])
    response = None

    try:
        db.chats.update_one(
            {"users": {"$all": request.json["users"]}},
            {"$set": {"messages.$[].was_readed": True}},
        )

        response = "successful", 200
    except Exception as error:
        response = f"error {error}", 200

    return response


@index.get("/chats/<user>")
@validate()
def get_chats(user):
    validate_email(user)

    chats = list(db.chats.find({"users": user}).sort("update_at", pymongo.DESCENDING))

    final_chat = []

    if chats:
        for chat in chats:
            for other_user in chat["users"]:
                if user != other_user:
                    another_user = db.users.find_one({"email": str(other_user)})
                    another_user["_id"] = str(another_user["_id"])

                    final_chat.append(
                        {"messages": chat["messages"], "user": another_user}
                    )

    return (final_chat, 200) if chats else ([], 200)


@index.get("/users/states/<user>")
@validate()
def get_states(user):
    validate_email(user)

    users = list(db.chats.find({"users": user}))
    final_users = []

    for u in users:
        for another_user in u["users"]:
            if another_user != user:
                other_user = db.users.find_one({"email": another_user})

                final_users.append(
                    {"user": another_user, "last_stay": other_user["last_stay"]}
                )

    return final_users
