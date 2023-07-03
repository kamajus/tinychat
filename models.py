from pydantic import BaseModel, EmailStr

class UserModel(BaseModel):
    name: str
    email: EmailStr
    photoURL: str
    

class ChatModel(BaseModel):
    pass