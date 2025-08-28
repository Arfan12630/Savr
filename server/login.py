from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from security import verify_password,get_password_hash
from sqlmodel import Session, select
from models import get_db
from typing import Annotated
from user_models import User
from pydantic import BaseModel
from datetime import timedelta

login = APIRouter(prefix="/login", tags=["login"])
SessionDep = Annotated[Session, Depends(get_db)]

def check_user_exists(session: Session, email: str):
    db_user = select(User).where(User.email == email)
    session_user = session.exec(db_user).first()
    return session_user


def authenticate(*,session: Session, email: str, password: str):
    user = check_user_exists(session=session, email=email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

class LoginRequest(BaseModel):
    email: str
    password: str


@login.post("/login/access-token")
def login_access_token(session: SessionDep, form_data: LoginRequest):
   user = authenticate(session=session, email=form_data.email, password=form_data.password)   
   if not user:
      raise HTTPException(status_code=401, detail="Invalid credentials")
   return user
   #TODO: Add access token duration and test jwt
   #access_token_duration = timedelta(minutes=30)
