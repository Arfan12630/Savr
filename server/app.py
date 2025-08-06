from flask import Flask, request, jsonify
from flask_cors import CORS
import os 
from dotenv import load_dotenv
from models import db, Restaurant
from RestuarantScraping.Scraper import scraper
from RestuarantScraping.restuarantEntry import restuarantEntry
from RestuarantScraping.MenuImage import menuImage
import uuid
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
app = Flask(__name__)
# Configure CORS properly for all routes
CORS(app, resources={
    r"/*": {"origins": "http://localhost:3000"},
})
app.register_blueprint(scraper)
app.register_blueprint(menuImage)
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
                    name=data['restaurantCardData']['restaurantCardData']['restaurant'], 
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
            "name": layout.name,
            "address": layout.address,
            "chairs": layout.chairs,
            "tables": layout.tables,
            "created_at": layout.created_at
        })
    else:
        return jsonify({"message": "No layout found"}), 404

@app.route('/auto-assign-tables', methods=['GET'])
def auto_assign_tables():
    name = request.args.get('name')
    address = request.args.get('address')
    party_size = request.args.get('party_size')
    time = request.args.get('time')
    occasion = request.args.get('occasion')
   
    layout = Layout.query.filter_by(name=name, address=address).first()
    if layout:
        if isinstance(layout.tables, list):
            for table in layout.tables:
                try:
                    print(table['maxPartySizeRange'])
                    party_size_range = table['maxPartySizeRange'].split('-')
                    print(party_size_range)
                    if (occasion.lower() in table['description'].lower() and 
                        int(party_size) >= int(party_size_range[0]) and 
                        int(party_size) <= int(party_size_range[1])):
                        
                        print(table['description'])
                        return jsonify({
                            "id": layout.id,
                            "name": layout.name,
                            "address": layout.address,
                            "tables": table,
                            "created_at": layout.created_at
                        })
                except (KeyError, ValueError, IndexError) as e:
                    # Handle tables that might not have the required fields
                    print(f"Error processing table: {e}")
                    continue
                    
            # Only return this if no matching table was found after checking ALL tables
            return jsonify({"message": "Let User choose own table"}), 200
        else:
            # Handle case where tables is a single object, not a list
            table = layout.tables
            try:
                party_size_range = table['maxPartySizeRange'].split('-')
                if (occasion.lower() in table['description'].lower() and 
                    int(party_size) >= int(party_size_range[0]) and 
                    int(party_size) <= int(party_size_range[1])):
                    
                    return jsonify({
                        "id": layout.id,
                        "name": layout.name,
                        "address": layout.address,
                        "tables": table,
                        "created_at": layout.created_at
                    })
            except (KeyError, ValueError, IndexError):
                pass
                
            return jsonify({"message": "Let User choose own table"}), 200
    else:
        return jsonify({"message": "No layout found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

