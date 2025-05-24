from dotenv import load_dotenv
import os
from flask import jsonify
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

# Load .env file
load_dotenv()
openai_api_key = os.environ.get("OPENAI_API_KEY")
geography_api_key = os.environ.get("GEOGRAPHY_API_KEY")

# Step 1: Define the output schema
class RestaurantEntry(BaseModel):
    restaurant: str
    city: str
    state: str
    menu_image_urls: str

# Step 2: Create parser
parser = PydanticOutputParser(pydantic_object=RestaurantEntry)

# Step 3: Create prompt
prompt = PromptTemplate(
    template="""
You are a helpful assistant that helps restaurant owners submit their restaurant information into a database.

They will enter one field at a time. After each input, update and display the current state of collected info. 
Then, respond with a friendly prompt for the next missing field. You just received input for: {current_field}

When all fields are filled, summarize the info in the following format:
{format_instructions}

Current Info:
Restaurant: {restaurant}
City: {city}
State: {state}
Menu Image URLs: {menu_image_urls}
""",
    input_variables=["restaurant", "city", "state", "menu_image_urls", "current_field", "format_instructions"]
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
    return {
        "status": "valid",
        "city": city,
        "state": state,
        "country": country,
        "restaurant_data": restaurant_data
    }

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
    "state": "",
    "menu_image_urls": ""
}

# Step 6: Collect first two inputs
first_fields = ["restaurant", "city"]
for field in first_fields:
    value = input(f"Please enter {field.replace('_', ' ')}: ")
    restaurant_info[field] = value.strip()

# Call get_address_info after first two inputs
address_info = get_address_info(restaurant_info["restaurant"], restaurant_info["city"])
#print("Address info:", address_info)
dataCards  = address_info["restaurant_data"]
for card in dataCards:
    print("Card Address", card["address"])

# Step 7: Collect remaining inputs
second_fields = ["state", "menu_image_urls"]
for field in second_fields:
    value = input(f"Please enter {field.replace('_', ' ')}: ")
    restaurant_info[field] = value.strip()

# Step 8: Now you can run the chain with all inputs
result = chain.run(
    restaurant=restaurant_info["restaurant"],
    city=restaurant_info["city"],
    state=restaurant_info["state"],
    menu_image_urls=restaurant_info["menu_image_urls"],
    current_field=field,  # This will be the last field entered
    format_instructions=parser.get_format_instructions()
)

print("\n--- Assistant Response ---")
print(result)
print("--------------------------\n")

# Step 8: Parse the final result into a structured Python object
parsed = parser.parse(result)
print("✅ Final Parsed Output:")
print(parsed.dict())
