from flask import Flask, request, jsonify
from flask_cors import CORS
import os 
from dotenv import load_dotenv
from models import db, Restaurant
from RestuarantScraping.Scraper import scraper
from RestuarantScraping.restuarantEntry import restuarantEntry
import uuid
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
app = Flask(__name__)
# Configure CORS properly for all routes
CORS(app, resources={
    r"/*": {"origins": "http://localhost:3000"},
})
app.register_blueprint(scraper)

app.register_blueprint(restuarantEntry)

load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("SQL_DB_LINK")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

class Layout(db.Model):
    __tablename__ = 'layouts'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = db.Column(db.DateTime, default=db.func.now())
    chairs = db.Column(db.JSON)
    tables = db.Column(db.JSON)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text)

with app.app_context():
    db.create_all()


#Creating this to get the layout from the owners
@app.route('/save-layout', methods=['POST', 'OPTIONS'])
def save_layout():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.json
    layout = Layout(id = uuid.uuid4(), 
                    chairs=data['layout']['chairs'], 
                    tables=data['layout']['tables'], 
                    name=data['restaurantCardData']['restaurantCardData']['name'], 
                    address=data['restaurantCardData']['restaurantCardData']['address'], 
                    created_at=datetime.now())
    
    db.session.add(layout)
    db.session.commit()
    return jsonify(data)

#have to edit this to where we to click something to get the layout
@app.route('/get-layout', methods=['GET'])
def get_layout():
    layout = Layout.query.order_by(Layout.id.desc()).first()
    if layout:
        return jsonify({
            "chairs": layout.chairs,
            "tables": layout.tables,
            "created_at": layout.created_at
        })
    else:
        return jsonify({"message": "No layout found"}), 404


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

