from datetime import datetime, timedelta, timezone
from typing import Any
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from fastapi import HTTPException, status
import secrets
from passlib.context import CryptContext    

from user_models import TokenPayload

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def generate_access_token(id:str, expires_delta: timedelta):
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(id)}
    encoded_jwt = jwt.encode(to_encode, secrets.token_urlsafe(32), algorithm=ALGORITHM)
    return encoded_jwt

