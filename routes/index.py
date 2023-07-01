from flask import Blueprint, request
from pydantic import BaseModel, EmailStr
from flask_pydantic import validate

index = Blueprint('index', __name__)

class UserModel(BaseModel):
    name: str
    email: EmailStr
    photoURL: str

@index.post('/login')
@validate()
def login():
    user = UserModel(
        name=request.json['name'], 
        email=request.json['email'], 
        photoURL=request.json['photoURL']
    )
    
    return user
