from dotenv import load_dotenv
import os
from flask import jsonify, Blueprint, request
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from requests.structures import CaseInsensitiveDict
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from dateutil import parser as date_parser
import time
import json
from models import db, Restaurant_Entry
import uuid
from concurrent.futures import ThreadPoolExecutor
from RestuarantScraping.MenuCards import image_to_html, process_images_in_parallel
from RestuarantScraping.RagEmbeddings import image_to_RAG_chunks, embedding_chunks, process_imagesRags_in_parallel, rag_embeddings
# Load .env file
load_dotenv()
restuarantEntry = Blueprint('restuarantEntry', __name__)

openai_api_key = os.environ.get("OPENAI_API_KEY")
geography_api_key = os.environ.get("GEOGRAPHY_API_KEY")

# Step 1: Define the output schema
class RestaurantEntry(BaseModel):
    restaurant: str
    city: str

# Step 2: Create parser
parser = PydanticOutputParser(pydantic_object=RestaurantEntry)

# Step 3: Create prompt
prompt = PromptTemplate(
    template="""
You are a helpful assistant that helps restaurant owners submit their restaurant information into a database.

You will receive one field at a time. After each input, return the **current state** of the information you have **strictly in JSON format**.

Only include JSON. No extra commentary. Your response must match this schema exactly:
{format_instructions}

Current Info:
Restaurant: {restaurant}
City: {city}
""",
    input_variables=["restaurant", "city", "current_field", "format_instructions"]
)


# Step 4: Initialize LLM and chain
llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=openai_api_key)
chain = LLMChain(llm=llm, prompt=prompt)

def url_maker(city, province, country, restuarantName):
    print("REACHED URL MAKERS")
    new_url = f"https://www.sirved.com/city/{city}-{province}-{country}/all?keyword={restuarantName}"
    restuarant_data = scrape_restaurant_data(new_url)
    return restuarant_data

def get_address_info(restaurant, city):
    # Get city details from geography API
    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"
    autocompletion_url = f"https://api.geoapify.com/v1/geocode/autocomplete?text={city}&apiKey={geography_api_key}"
    autocompletion_response = requests.get(autocompletion_url, headers=headers)
    autocompletion_data = autocompletion_response.json()
    
    # Check if we got valid location data
    if not autocompletion_data.get("features"):
        return {
            "status": "invalid",
            "message": f"Could not find location information for '{city}'. Please check spelling or try another city."
        }
        
    first_feature = autocompletion_data["features"][0]
    properties = first_feature.get("properties", {})
    country = properties.get("country")
    state = properties.get("state")
    city_name = properties.get("city") or properties.get("county")
    if city in city_name:
        city_name = city
    print("Altered City name", city)
    if not state or not city_name:
        return {
            "status": "invalid", 
            "message": f"Could not determine state/province for '{city}'. Please be more specific."
        }
    restaurant_data = url_maker(city, state, country, restaurant)
    restaurant_info = {
        "restaurant": restaurant,
        "city": city,
        "address": "",
        "cards": restaurant_data
    }
    return restaurant_info

def scrape_restaurant_data(url):
    print("REACHED SCRAPE RESTAURANT DATA")
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


    restaurants = []
    for i in range(len(names)):
        restaurant = {
            "name": names[i] if i < len(names) else "",
            "address": addresses[i] if i < len(addresses) else "",
            "hours": hours[i] if i < len(hours) else "",
            "logo": logos[i] if i < len(logos) else "",
        }
        restaurants.append(restaurant)
    return restaurants

# Step 5: Info holder
restaurant_info = {
    "restaurant": "",
    "city": "",
    "address": "",
}



@restuarantEntry.route('/get-address-options', methods=['POST'])
def get_address_options():
    data = request.json
    for field in ["restaurant", "city"]:
       restaurant_info[field] = data.get(field)
    address_info = get_address_info(restaurant_info["restaurant"], restaurant_info["city"])
    restaurant_info["address"] = address_info["address"]
    restaurant_info["cards"] = address_info["cards"]
    if all(restaurant_info.values()):
        print("RESTAURANT INFO", restaurant_info)
    result = chain.run(
        restaurant=restaurant_info["restaurant"],
        city=restaurant_info["city"],
        current_field=field,  # This will be the last field entered
        format_instructions=parser.get_format_instructions()
    )

    print("\n--- Raw LLM Output ---")
    print(result)
    print("----------------------\n")

    # Step 8: Parse the final result into a structured Python object
    parsed = parser.parse(result)
    print("✅ Final Parsed Output:")
    print(parsed.dict())
    return jsonify(restaurant_info)

@restuarantEntry.route('/get-address-info', methods=['POST'])
def place_in_DB():
    data = request.json
    restaurant_entry = Restaurant_Entry(
        id=uuid.uuid4(),
        name=data["name"],
        address=data["address"],
        hours=data["hours"],
        logo=data["logo"],
        created_at=datetime.now(),
        rag_ready=False
    )
    if Restaurant_Entry.query.filter_by(name=data["name"], address=data["address"]).first():
        return jsonify({"message": "Restaurant already exists"})
    db.session.add(restaurant_entry)
    db.session.commit()
    return jsonify(data)

@restuarantEntry.route('/extract-menu-html', methods=['POST'])
def extract_menu_html():
    data = request.json
    image_urls = data["image_urls"]
    restaurant_data = data["restaurant_data"]
    menu_html = process_images_in_parallel(image_urls)
    # executor = ThreadPoolExecutor(max_workers=10)
    # executor.submit(rag_embeddings, image_urls)
    if not restaurant_data and not image_urls:
        return jsonify({"message": "No data provided", "status": "error"})
    
    # Just return the extracted HTML, don't save to DB yet
    response = {"menu_html": menu_html,
    "status": "HTML Extracted Successfully, Rag Remaining"}  # Assuming single image

    executor = ThreadPoolExecutor(max_workers=10)
    executor.submit(rag_embeddings, image_urls)
    return jsonify(response)


@restuarantEntry.route('/save-all-menu-html', methods=['POST'])
def save_all_menu_html():
    data = request.json
    restaurant_data = data["restaurant_data"]
    menu_htmls = data["menu_htmls"]  # List of HTML strings
    
    entry = Restaurant_Entry.query.filter_by(
        name=restaurant_data["name"], 
        address=restaurant_data["address"]
    ).first()
    
    if not entry:
        return jsonify({"message": "Entry not found"}), 404
    
    # Store as array of strings or concatenate them
    entry.menu_html = menu_htmls  # If your column is ARRAY(Text) or JSON
    entry.rag_ready = True
    # OR concatenate: entry.menu_html = "\n\n".join(menu_htmls)
    
    db.session.commit()
    return jsonify({"message": "All menu HTMLs saved successfully"})

@restuarantEntry.route('/get-all-menu-html', methods=['GET'])
def get_all_menu_html():
    entry = Restaurant_Entry.query.filter_by(name="Afghani Cuisine Restaurant").first()
    return jsonify({"menu_htmls": entry.menu_html})