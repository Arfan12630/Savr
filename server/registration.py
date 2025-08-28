from fastapi import APIRouter, Depends, HTTPException 
import uuid
from models import get_db
from user_models import User, UserPublic, UserRegister
from sqlmodel import Session
from security import get_password_hash

registration = APIRouter(prefix="/registration", tags=["registration"])

def check_email_exists(email: str, db: Session) -> bool:
    return db.query(User).filter(User.email == email).first() is not None

#TODO: Add email verification with code to verify email should be done in the future
def check_user_role(user: User) -> bool:
    return user.is_active

def create_user(user: UserRegister, db: Session) -> User:
    if check_email_exists(user.email, db):
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(
        id=uuid.uuid4(),
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        is_active=True,
        hashed_password=get_password_hash(user.password),
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@registration.post("/signup", response_model=UserPublic)
def signup(user: UserRegister, db: Session = Depends(get_db)) -> UserPublic:
    db_user = create_user(user, db)
    # Manually create UserPublic object to exclude hashed_password
    return UserPublic(
        id=db_user.id,
        email=db_user.email,
        full_name=db_user.full_name,
        phone_number=db_user.phone_number,
        is_active=db_user.is_active,
    )
@registration.post("/signup", response_model=User)
def signup(user: UserRegister, db: Session = Depends(get_db)) -> User:
    return create_user(user, db)

