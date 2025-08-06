from bs4 import BeautifulSoup
import requests
from flask import Blueprint, jsonify
from openai import OpenAI
import openai
import os 
from dotenv import load_dotenv
import json
from flask import request
from flask_cors import CORS
import base64
import requests
from requests.structures import CaseInsensitiveDict
from models import db, Restaurant, Restaurant_Entry
import datetime


menuImage = Blueprint('menuImage', __name__)

@menuImage.route('/upload-menu-item-image', methods=['POST'])
def upload_menu_image():
    print("Reached here")
    data = request.get_json()
    image_url = data.get('imageUrl')
    print(image_url[:10])
    
    return jsonify({'message': 'Menu image uploaded successfully', 'imageUrl': image_url}), 200

