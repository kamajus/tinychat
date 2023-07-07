from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserModel(BaseModel):
    name: str
    email: EmailStr
    photoURL: str
    last_stay: datetime
    
class MessageModel(BaseModel):
    owner: EmailStr
    target: EmailStr
    content: str  
    created_at: datetime