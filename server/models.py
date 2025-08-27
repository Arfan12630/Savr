import os
import uuid
from datetime import datetime

from sqlalchemy import (Boolean, Column, DateTime, Integer, String, Text,
                        create_engine, func)
from sqlalchemy.dialects.postgresql import ARRAY, JSON, UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database setup
SQLALCHEMY_DATABASE_URL = os.environ.get("SQL_DB_LINK")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Restaurant(Base):
    """Restaurant model for basic restaurant information."""

    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    hours = Column(String(255))
    link = Column(Text)
    menu_images = Column(JSON)
    menu_html = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    logo = Column(Text)


class RestaurantEntry(Base):
    """Restaurant entry model with enhanced features."""

    __tablename__ = "restaurant_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    hours = Column(ARRAY(String(2556)))
    menu_images = Column(JSON)
    menu_html = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    rag_ready = Column(Boolean, default=False)
    logo = Column(Text)


class Reservations(Base):
    """Reservation model for table bookings."""

    __tablename__ = "reservations"

    reservation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True))
    restaurant_name = Column(String(255), nullable=False)
    restaurant_address = Column(Text)
    table_id = Column(UUID(as_uuid=True))
    reservation_date = Column(DateTime, nullable=False)
    reservation_time = Column(DateTime, nullable=False)
    reservation_status = Column(String(255), default="pending")
    start_cooking = Column(Text, nullable=False)
    order = Column(JSON)


class SharedMenuLink(Base):
    """Shared menu link model for group dining sessions."""

    __tablename__ = "shared_menu_link"

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_name = Column(String(255), nullable=False)
    table_number = Column(String(255), nullable=False)
    host_user_id = Column(UUID(as_uuid=True), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    link = Column(Text, nullable=False)
    participants = Column(ARRAY(UUID))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class Layout(Base):
    """Layout model for restaurant floor plans."""

    __tablename__ = "layouts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=func.now())
    chairs = Column(JSON)
    tables = Column(JSON)
    name = Column(String(255), nullable=False)
    address = Column(Text)


# Create tables
Base.metadata.create_all(bind=engine)
