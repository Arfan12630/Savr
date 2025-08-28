from fastapi import APIRouter, Depends, HTTPException, Request
import uuid
from typing import Any
from models import get_db
from user_models import User, UserRegister, UserCreate
from sqlmodel import Session
from datetime import datetime
from security import get_password_hash
registration = APIRouter(prefix="/registration", tags=["registration"])


# Guard to see if email exists
def check_email_exists(email: str, db: Session) -> bool:
    return db.query(User).filter(User.email == email).first() is not None

#TODO: Add email verification with code to verify email should be done in the future
# Function to create a user 
def create_user(user: UserRegister, db: Session) -> User:
    if check_email_exists(user.email, db):
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(
        id=uuid.uuid4(),
        email=user.email,
        hashed_password=get_password_hash(user.password),
        full_name=user.full_name,
        phone_number=user.phone_number,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@registration.post("/signup", response_model=User)
def signup(user: UserRegister, db: Session = Depends(get_db)) -> User:
    return create_user(user, db)

