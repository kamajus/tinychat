from flask import Blueprint, request
from flask_pydantic import validate
from pydantic import validate_email
from models import UserModel, UsersList
from db import db

from datetime import datetime

import pymongo

index = Blueprint('index', __name__)

@index.post('/login')
@validate()
def login():
    user = {
        "name": request.json['name'],
        "email": request.json['email'],
        "photoURL": request.json['photoURL'],
        "last_stay": datetime.now().isoformat()
    }
    
    UserModel(**user)
    
    userExists = db.users.find_one({"email": user["email"]})
    
    if (userExists):
        userExists['_id'] = str(userExists['_id'])
        return userExists
    else:
        user_id = db.users.insert_one(user).inserted_id
        user['_id'] = str(user_id)
        
        return user, 201


@index.get('/search/<search>')
def get_users(search: str):
    users = list(db.users.find({"email": {'$regex': search}}))
    users_ = []
    
    for user in users:
        user['_id'] = str(user['_id'])
        users_.append(user)
                
    return (users_, 200) if users_ else ("not exists", 400)

@index.put('/read_messages')
@validate()
def read_messages():
    UsersList(users=request.json["users"])
    response = None
    
    try:
        db.chats.update_one({"users": {"$all":request.json["users"]}}, {
            "$set": {
                "messages.$[].was_readed": True
            }
        })
        
        response = "sucefull", 200
    except Exception as error:
        response = f"error {error}", 200
        
    return response

@index.get('/chats/<user>')
@validate()
def get_chats(user):
    validate_email(user)
    
    chats = list(db.chats.find({"users":user}).sort('update_at', pymongo.DESCENDING))
    
    final_chat = []
    
    if chats: 
        for chat in chats:
            for other_user in chat['users']:
                if user != other_user:
                    another_user = db.users.find_one({"email": str(other_user)})
                    another_user['_id'] = str(another_user['_id'])
                    
                    final_chat.append({
                        "messages": chat['messages'],
                        "user": another_user
                    })                  
        
    return (final_chat, 200) if chats else ("you dont have chats!", 400)


@index.get('/users/states/<user>')
@validate()
def get_states(user):
    validate_email(user)
    
    users = list(db.chats.find({"users":user}))
    final_users = []
    
    for u in users:
        for another_user in u["users"]:
            if another_user != user:
                other_user = db.users.find_one({"email": another_user})
                                
                final_users.append({
                    "user": another_user,
                    "last_stay": other_user['last_stay']
                })
        
    return final_users

