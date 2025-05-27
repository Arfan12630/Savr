from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid

db = SQLAlchemy()

class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text)
    hours = db.Column(db.String(255))
    logo = db.Column(db.Text)
    link = db.Column(db.Text)
    menu_images = db.Column(db.JSON)
    menu_html = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=db.func.now())

class Restaurant_Entry(db.Model):
    __tablename__ = 'restaurant_entries'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text)
    hours = db.Column(db.String(255))
    logo = db.Column(db.Text)
    menu_images = db.Column(db.JSON)
    menu_html = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=db.func.now())
