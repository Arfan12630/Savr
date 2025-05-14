from flask_sqlalchemy import SQLAlchemy

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
