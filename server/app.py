from flask import Flask, request, jsonify
from flask_cors import CORS
import os 
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from RestuarantScraping.Scraper import scraper

app = Flask(__name__)
# Configure CORS properly for all routes
CORS(app, resources={
    r"/*": {"origins": "http://localhost:3000"},
})
app.register_blueprint(scraper)
load_dotenv()

layout_collection_DB = os.environ.get("SQL_DB_LINK")
app.config['SQLALCHEMY_DATABASE_URI'] = layout_collection_DB
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Layout(db.Model):
    __tablename__ = 'layouts'
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    chairs = db.Column(db.JSON)
    tables = db.Column(db.JSON)

with app.app_context():
    db.create_all()


#Creating this to get the layout from the owners
@app.route('/save-layout', methods=['POST', 'OPTIONS'])
def save_layout():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.json
    layout = Layout(chairs=data['chairs'], tables=data['tables'])
    db.session.add(layout)
    db.session.commit()
    return jsonify(data)

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
    app.run(debug=True)

