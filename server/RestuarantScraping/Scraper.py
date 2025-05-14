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
from models import db, Restaurant

load_dotenv()

openai_api_key = os.environ.get("OPENAI_API_KEY")
geography_api_key = os.environ.get("GEOGRAPHY_API_KEY")
client = OpenAI(api_key=openai_api_key)

scraper = Blueprint('scraper', __name__)
#Country will be canada for now
def url_manipulation(city, province, restuarantName,country = "canada"):
    new_url = f"https://www.sirved.com/city/{city}-{province}-{country}/all?keyword={restuarantName}"
    restuarant_data = scrape_restaurant_data(new_url)
    return restuarant_data

def function_scheme():
    function_schema = {
    "name": "extract_restaurant_location",
    "description": "Extract restaurant name and city from user input",
    "parameters": {
        "type": "object",
        "properties": {
            "restaurant": {
                "type": "string",
                "description": "The name of the restaurant"
            },
            "city": {
                "type": "string",
                "description": "The city where the user wants to eat"
            },
        },
        "required": ["restaurant", "city"]
    }
}
    return function_schema


def chatbot_response(function_schema, user_input):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": user_input}],
        functions=[function_schema],
        function_call="auto"
    )

    return response

def get_city_and_country():
    chatdata = chatbot_response(function_scheme(), "I want to eat from Ennios in Waterloo")
    args_str = chatdata.choices[0].message.function_call.arguments
    args = json.loads(args_str)
    city = args["city"] #pass this guy to the geography api
    restaurant = args["restaurant"]

    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"
    autocompletion_url = f"https://api.geoapify.com/v1/geocode/autocomplete?text={city}&apiKey={geography_api_key}"
    autocompletion_response = requests.get(autocompletion_url, headers=headers)
    autocompletion_data = autocompletion_response.json() 

    # Check if there are any features
    if autocompletion_data.get("features"):
        first_feature = autocompletion_data["features"][0]
        properties = first_feature.get("properties", {})
        # Now you can access fields like:
        country = properties.get("country")
        state = properties.get("state")
        city = properties.get("city")  # May not always be present, sometimes 'county' or 'formatted' is used
        print("Country:", country)
        print("State/Province:", state)
        print("City:", city)
        print("All properties:", properties)
    else:
        print("No features found in autocompletion data.")
    url_manipulation(city, state, restaurant)


def scrape_restaurant_data(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all restaurant cards
    names = [atag.text.strip() for atag in soup.select('h3.text-truncate a')]
    addresses = [
        ', '.join([line.strip() for line in div.text.strip().split('\n') if line.strip()])
        for div in soup.find_all('div', class_="res-address")
    ]
    hours = [div.text.strip() for div in soup.find_all('div', class_="res-responce text-truncate open")]
    logos = [img.get('data-src') for img in soup.find_all('img', class_="visible lozad")]
    links = [a.get('href') for a in soup.find_all('a', class_="click-overlay")]

    restaurants = []
    for i in range(len(names)):
        restaurant = {
            "name": names[i] if i < len(names) else "",
            "address": addresses[i] if i < len(addresses) else "",
            "hours": hours[i] if i < len(hours) else "",
            "logo": logos[i] if i < len(logos) else "",
            "link": links[i] if i < len(links) else "",
            "menu_images": [],
            "menu_html": []
        }
        # Scrape menu images for this restaurant
        llurl = "https://www.sirved.com" + restaurant["link"]
        menu_urlss = llurl[:-1]
        menu_response = requests.get(menu_urlss, headers=headers)
        menu_soup = BeautifulSoup(menu_response.text, 'html.parser')
        menu_images = menu_soup.find_all('img', class_="lozad")
        image_urls = []
        for image in menu_images[:-1]:
            image_url = image.get('data-src')
            if image_url:
                image_urls.append(image_url)
#image_html = image_to_html(image_url)
        restaurant["menu_images"] = image_urls
        #restaurant["menu_html"] = image_html
        restaurants.append(restaurant)
    return restaurants


#Post request to get the text from frontend
@scraper.route('/chat', methods=['POST', 'OPTIONS'])
def get_restaurants():
    if request.method == 'OPTIONS':
        # Add CORS headers for preflight requests
        response = jsonify({"message": "Preflight request successful"})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    data = request.get_json()
    input_text = data.get('message')
    print(f"Received input: {input_text}")

    try:
        # Extract restaurant and city from user input
        chatdata = chatbot_response(function_scheme(), input_text)
        
        if not hasattr(chatdata.choices[0].message, 'function_call'):
            return jsonify({
                "status": "invalid",
                "message": "Could not extract restaurant and city information from your message. Please try again."
            })
            
        args_str = chatdata.choices[0].message.function_call.arguments
        args = json.loads(args_str)
        
        # Validate if we have both city and restaurant
        if not args.get("city") or not args.get("restaurant"):
            return jsonify({
                "status": "invalid",
                "message": "Could not identify both restaurant and city. Please provide both."
            })
            
        city = args["city"]
        restaurant = args["restaurant"]
        
        # Get city details from geography API
        headers = CaseInsensitiveDict()
        headers["Accept"] = "application/json"
        autocompletion_url = f"https://api.geoapify.com/v1/geocode/autocomplete?text={city}&apiKey={geography_api_key}"
        autocompletion_response = requests.get(autocompletion_url, headers=headers)
        autocompletion_data = autocompletion_response.json()
        
        # Check if we got valid location data
        if not autocompletion_data.get("features"):
            return jsonify({
                "status": "invalid",
                "message": f"Could not find location information for '{city}'. Please check spelling or try another city."
            })
            
        first_feature = autocompletion_data["features"][0]
        properties = first_feature.get("properties", {})
        country = properties.get("country")
        state = properties.get("state")
        city_name = properties.get("city") or properties.get("county")
        
        if not state or not city_name:
            return jsonify({
                "status": "invalid", 
                "message": f"Could not determine state/province for '{city}'. Please be more specific."
            })
            
        # Get restaurant data
        restaurant_data = url_manipulation(city, state, restaurant)
        
        if not restaurant_data:
            return jsonify({
                "status": "invalid",
                "message": f"Could not find '{restaurant}' in {city}, {state}. Please check spelling or try another restaurant."
            })
            
        return jsonify({
            "status": "valid",
            "message": f"Found information for {restaurant} in {city}, {state}",
            "data": {
                "restaurant": restaurant,
                "city": city_name,
                "state": state,
                "country": country,
                "results": restaurant_data
            }
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"An error occurred while processing your request: {str(e)}"
        })


