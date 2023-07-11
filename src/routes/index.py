from flask import Blueprint, request, jsonify
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


@index.get('/search/users/<email>')
@validate()
def get_users(email: str):
    validate_email(email)
    
    user = db.users.find_one({"email": email})

    if (user):
        user['_id'] = str(user['_id'])
        
    return (user, 200) if user else ("not exists", 400)


@index.post('/messages')
@validate()
def get_messages():    
    print(f'users: {request.json["users"]}')
    UsersList(users=request.json["users"])
    
    chat = db.chats.find_one({"users": {"$all":request.json["users"]}})
    
    return (chat['messages'], 200) if chat else ("you dont have message", 400)


@index.put('/read_messages')
@validate()
def read_messages():
    print(f'users: {request.json["users"]}')
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
                print(other_user)
                
                final_users.append({
                    "user": another_user,
                    "last_stay": other_user['last_stay']
                })
        
    return final_users
        
    
