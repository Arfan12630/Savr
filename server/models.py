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
    rag_ready = db.Column(db.Boolean, default=False)


# class Order(db.Model):
#     __tablename__ = 'orders'
#     id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     user_id = db.Column(UUID(as_uuid=True), primary_key=True)
#     restaurant_id = db.Column(UUID(as_uuid=True), primary_key=True)
#     table_id = db.Column(UUID(as_uuid=True), primary_key=True)
#     order_items = db.Column(db.JSON)
#     order_status = db.Column(db.String(255), default='pending')
#     order_total = db.Column(db.Float, default=0.0)
#     order_created_at = db.Column(db.DateTime, default=db.func.now())
#     order_updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
#     order_notes = db.Column(db.Text)

# class User(db.Model):
#     __tablename__ = 'users'
#     id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     name = db.Column(db.String(255), nullable=False)
#     email = db.Column(db.String(255), nullable=False)
#     phone = db.Column(db.String(255), nullable=False)
#     address = db.Column(db.Text)
#     created_at = db.Column(db.DateTime, default=db.func.now())