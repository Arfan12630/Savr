import os
import uuid
from datetime import datetime
from typing import Optional
from collections.abc import Generator
from sqlmodel import SQLModel, Field, create_engine, Session
from sqlalchemy.dialects.postgresql import ARRAY, JSON, UUID
from sqlalchemy import func, DateTime, String
import user_models

# Database setup
SQLALCHEMY_DATABASE_URL = os.environ.get("SQL_DB_LINK")
engine = create_engine(SQLALCHEMY_DATABASE_URL)


def get_db() -> Generator[Session, None, None]:
    """Get database session."""
    with Session(engine) as session:
        yield session


class Restaurant(SQLModel, table=True):
    """Restaurant model for basic restaurant information."""
    
    __tablename__ = "restaurants"
    
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    address: str | None = Field(default=None)
    hours: str | None = Field(default=None, max_length=255)
    link: str | None = Field(default=None)
    menu_images: dict | None = Field(default=None, sa_type=JSON)
    menu_html: dict | None = Field(default=None, sa_type=JSON)
    created_at: datetime | None = Field(
        default_factory=datetime.now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now()},
    )
    logo: str | None = Field(default=None)


class RestaurantEntry(SQLModel, table=True):
    """Restaurant entry model with enhanced features."""
    
    __tablename__ = "restaurant_entries"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, sa_type=UUID(as_uuid=True))
    name: str = Field(max_length=255)
    address: str | None = Field(default=None)
    hours: list[str] | None = Field(default=None, sa_type=ARRAY(String))
    menu_images: dict | None = Field(default=None, sa_type=JSON)
    menu_html: dict | None = Field(default=None, sa_type=JSON)
    created_at: datetime | None = Field(
        default_factory=datetime.now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now()},
    )
    rag_ready: bool = Field(default=False)
    logo: str | None = Field(default=None)


class Reservations(SQLModel, table=True):
    """Reservation model for table bookings."""
    
    __tablename__ = "reservations"
    
    reservation_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, sa_type=UUID(as_uuid=True))
    user_id: uuid.UUID | None = Field(default=None, sa_type=UUID(as_uuid=True))
    restaurant_name: str = Field(max_length=255)
    restaurant_address: str | None = Field(default=None)
    table_id: uuid.UUID | None = Field(default=None, sa_type=UUID(as_uuid=True))
    reservation_date: datetime
    reservation_time: datetime
    reservation_status: str = Field(default="pending", max_length=255)
    start_cooking: str
    order: dict | None = Field(default=None, sa_type=JSON)


class SharedMenuLink(SQLModel, table=True):
    """Shared menu link model for group dining sessions."""
    
    __tablename__ = "shared_menu_link"
    
    session_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, sa_type=UUID(as_uuid=True))
    restaurant_name: str = Field(max_length=255)
    table_number: str = Field(max_length=255)
    host_user_id: uuid.UUID = Field(sa_type=UUID(as_uuid=True))
    expires_at: datetime
    link: str
    participants: list[uuid.UUID] | None = Field(default=None, sa_type=ARRAY(UUID))
    created_at: datetime | None = Field(
        default_factory=datetime.now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: datetime | None = Field(
        default_factory=datetime.now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )


class Layout(SQLModel, table=True):
    """Layout model for restaurant floor plans."""
    
    __tablename__ = "layouts"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, sa_type=UUID(as_uuid=True))
    created_at: datetime | None = Field(
        default_factory=datetime.now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now()},
    )
    chairs: dict | None = Field(default=None, sa_type=JSON)
    tables: dict | None = Field(default=None, sa_type=JSON)
    name: str = Field(max_length=255)
    address: str | None = Field(default=None)


# Create all tables
SQLModel.metadata.create_all(bind=engine)