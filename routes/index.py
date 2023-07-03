from flask import Blueprint, request
from flask_pydantic import validate
from bson import ObjectId

from models import UserModel
from pydantic import EmailStr

from db import db

index = Blueprint('index', __name__)

@index.post('/login')
@validate()
def login():
    user_dict = {
        "name": request.json['name'],
        "email": request.json['email'],
        "photoURL": request.json['photoURL']
    }
    
    UserModel(**user_dict)
    
    userExists = db.users.find_one({"email": request.json['email']})
    
    if (userExists):
        userExists['_id'] = str(userExists['_id'])
        return userExists
    else:
        user_id = db.users.insert_one(user_dict).inserted_id
        user_dict['_id'] = str(user_id)
        
        return user_dict, 201

@index.get('/search/users/<email>')
def get_users(email: str):
    user = db.users.find_one({"email": email})
    
    print(user)
    if (user):
        user['_id'] = str(user['_id'])
    else:
        pass
        
    return (user, 200) if user else ("not exists", 404)

@index.post('/messages')
def get_messages():    
    chat = db.chats.find_one({"users": {"$all":request.json["users"]}})
    
    return (chat['messages'], 200) if chat else ("dont-have-message", 404)
    

@index.get('/chats/<user>')
def get_chats(user):
    chats = list(db.chats.find({"users":user}))
    
    final_chat = None
    
    if chats: 
        for chat in chats:
            for other_user in chat['users']:
                if user != other_user:
                    another_user = db.users.find_one({"email": other_user})
                    another_user['_id'] = str(another_user['_id'])
                    
                    final_chat = {
                        "messages": chat['messages'][-1],
                        "user": another_user
                    }                  
        
    return (final_chat, 200) if chats else ("dont-have-chats", 404)
        
    
