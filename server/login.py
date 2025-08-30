from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from security import verify_password,get_password_hash, generate_access_token
from sqlmodel import Session, select
from models import get_db
from typing import Annotated
from user_models import User, Token
from pydantic import BaseModel
from datetime import timedelta
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
import secrets
from fastapi import HTTPException, status
from security import ALGORITHM
from user_models import TokenPayload
login = APIRouter(prefix="/login", tags=["login"])
sessionDep = Annotated[Session, Depends(get_db)]
tokenDep = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="/api/login/access-token"))]
def get_current_user(session:sessionDep, token:tokenDep):
    try:
        payload = jwt.decode(token, secrets.token_urlsafe(32), algorithms=[ALGORITHM])
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/access-token")

CurrentUser = Annotated[User, Depends(get_current_user)]

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


@login.post("/access-token")
def login_access_token(session: sessionDep, form_data: LoginRequest):
   user = authenticate(session=session, email=form_data.email, password=form_data.password)   
   if not user:
      raise HTTPException(status_code=401, detail="Invalid credentials")
   access_token_duration = timedelta(minutes=30)
   return Token(
       access_token=generate_access_token(user.id, access_token_duration)
   )

