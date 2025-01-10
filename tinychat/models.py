from datetime import datetime
from typing import List

from pydantic import BaseModel, EmailStr


class UserModel(BaseModel):
    name: str
    email: EmailStr
    photoURL: str
    last_stay: datetime


class UserEmail(BaseModel):
    email: EmailStr


class MessageModel(BaseModel):
    from_email: EmailStr
    to_email: EmailStr
    content: str
    created_at: datetime


class UsersList(BaseModel):
    users: List[EmailStr]


class Chat(BaseModel):
    messages: List[MessageModel]
    user: EmailStr
