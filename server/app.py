from flask import Flask, request, jsonify
from flask_cors import CORS
import os 
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
CORS(app, resources={r"/save-layout": {"origins": "http://localhost:3000"}})
load_dotenv()

layout_collection_DB = os.environ.get("SQL_DB_LINK")
app.config['SQLALCHEMY_DATABASE_URI'] = layout_collection_DB
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)





#Creating this to get the layout from the owners
@app.route('/save-layout', methods=['POST', 'OPTIONS'])
def save_layout():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.json
    print(data)
    return jsonify({"message": "Layout saved"})

if __name__ == '__main__':
    app.run(debug=True)

