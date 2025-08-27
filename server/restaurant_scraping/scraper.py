import base64
import json
import os
import time
from datetime import date, datetime
from datetime import time as dt_time

import dateparser
import openai
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request
from openai import OpenAI
from pydantic import BaseModel
from requests.structures import CaseInsensitiveDict
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from sqlalchemy.orm import Session

from models import Restaurant, RestaurantEntry, get_db

load_dotenv()

openai_api_key = os.environ.get("OPENAI_API_KEY")
geography_api_key = os.environ.get("GEOGRAPHY_API_KEY")
google_api_key = os.environ.get("GOOGLE_API_KEY")
search_engine = "00bcf26a28ef24fe6"
client = OpenAI(api_key=openai_api_key)

scraper_router = APIRouter()


class ReservationRequest(BaseModel):
    """Request model for reservation details."""

    restaurant: str
    city: str
    party_size: int
    time: str
    occasion: str


def google_places_script(
    api_key, query, language_code="en", location_bias=None, included_type=None
):
    """Search for places using Google Places API."""
    # Base URL for Text Search (New)
    base_url = "https://places.googleapis.com/v1/places:searchText"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "*",
    }

    data = {
        "textQuery": query,
        "languageCode": language_code,
    }

    if location_bias:
        data["locationBias"] = location_bias

    if included_type:
        data["includedType"] = included_type

    try:
        response = requests.post(base_url, headers=headers, json=data)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
        return None

    return None


def url_manipulation(city, province, restaurant_name, country="canada"):
    """Manipulate URL for restaurant search."""
    new_url = f"https://www.sirved.com/city/{city}-{province}-{country}/all?keyword={restaurant_name}"

    restaurant_data = scrape_restaurant_data(new_url)
    return restaurant_data


def function_scheme():
    """Define function schema for OpenAI."""
    function_schema = {
        "name": "extract_reservation_details",
        "description": "Extract restaurant name, city, party size, and reservation time from user input",
        "parameters": {
            "type": "object",
            "properties": {
                "restaurant": {
                    "type": "string",
                    "description": "The name of the restaurant",
                },
                "city": {
                    "type": "string",
                    "description": "The city where the user wants to eat",
                },
                "party_size": {
                    "type": "integer",
                    "description": "The number of people in the party",
                },
                "time": {
                    "type": "string",
                    "description": "The time for the reservation, e.g. '7pm', '19:00', 'tonight', make sure we see that the time actually has 'PM' or 'AM' and if this field is not present, then we should not include it in the response.",
                },
                "occasion": {
                    "type": "string",
                    "description": "The occasion for the reservation, e.g. 'date', 'birthday', 'anniversary', 'business meeting', 'family dinner', 'family' etc.",
                },
            },
            "required": ["restaurant", "city", "party_size", "time", "occasion"],
        },
    }
    return function_schema


def chatbot_response(function_schema, user_input):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": user_input}],
        functions=[function_schema],
        function_call="auto",
    )

    return response


def save_restaurant_data(restaurants, db: Session):
    for restaurant in restaurants:
        restaurant_exists = (
            db.query(Restaurant)
            .filter_by(name=restaurant["name"], address=restaurant["address"])
            .first()
        )
        if not restaurant_exists:
            new_restaurant = Restaurant(
                name=restaurant["name"],
                address=restaurant["address"],
                hours=restaurant["hours"],
                logo=restaurant["logo"],
                link=restaurant["link"],
                menu_images=restaurant["menu_images"],
                menu_html=restaurant["menu_html"],
            )
            db.add(new_restaurant)
    db.commit()


def scrape_restaurant_data(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    # print(response.text[:1000])  # <-- Add this line to print the first 1000 characters of the HTML
    soup = BeautifulSoup(response.text, "html.parser")

    # Find all restaurant cards
    names = [atag.text.strip() for atag in soup.select("h3.text-truncate a")]
    addresses = [
        ", ".join(
            [line.strip() for line in div.text.strip().split("\n") if line.strip()]
        )
        for div in soup.find_all("div", class_="res-address")
    ]
    hours = [
        div.text.strip()
        for div in soup.find_all("div", class_="res-responce text-truncate open")
    ]
    logos = [
        img.get("data-src") for img in soup.find_all("img", class_="visible lozad")
    ]
    links = [a.get("href") for a in soup.find_all("a", class_="click-overlay")]

    restaurants = []
    for i in range(len(names)):
        restaurant = {
            "name": names[i] if i < len(names) else "",
            "address": addresses[i] if i < len(addresses) else "",
            "hours": hours[i] if i < len(hours) else "",
            "logo": logos[i] if i < len(logos) else "",
            "link": links[i] if i < len(links) else "",
            "menu_images": [],
            "menu_html": [],
        }
        # Scrape menu images for this restaurant
        llurl = "https://www.sirved.com" + restaurant["link"]
        menu_urlss = llurl[:-1]
        menu_response = requests.get(menu_urlss, headers=headers)
        menu_soup = BeautifulSoup(menu_response.text, "html.parser")
        menu_images = menu_soup.find_all("img", class_="lozad")
        image_urls = []
        for image in menu_images[:-1]:
            image_url = image.get("data-src")
            if image_url:
                image_urls.append(image_url)
        # image_html = image_to_html(image_url)
        restaurant["menu_images"] = image_urls
        # restaurant["menu_html"] = image_html
        restaurants.append(restaurant)
    # Note: This function needs a database session, but it's called from a non-route context
    # You might want to pass a session or handle this differently
    # save_restaurant_data(restaurants, db)
    return restaurants


# Post request to get the text from frontend
@scraper_router.post("/chat")
async def get_restaurants(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    input_text = data.get("message")
    print(f"Received input: {input_text}")

    try:

        # Extract restaurant and city from user input
        chatdata = chatbot_response(function_scheme(), input_text)

        # Check if function_call exists in the response
        if (
            not hasattr(chatdata.choices[0].message, "function_call")
            or chatdata.choices[0].message.function_call is None
        ):
            return {
                "status": "invalid",
                "message": "Could not understand your request. Please try again with more details about restaurant, city, party size, and time.",
            }

        args_str = chatdata.choices[0].message.function_call.arguments
        args = json.loads(args_str)

        # Validate if we have all required fields
        if not all(
            [
                args.get("city"),
                args.get("restaurant"),
                args.get("party_size"),
                args.get("time"),
            ]
        ):
            return {
                "status": "invalid",
                "message": "Could not identify all reservation details. Please provide restaurant, city, party size, and time.",
            }

        city = args["city"]
        restaurant = args["restaurant"]
        party_size = args["party_size"]
        time = args["time"]
        occasion = args["occasion"]
        # Try to parse the time string
        try:
            now = datetime.now()
            parsed_time = dateparser.parse(time, settings={"RELATIVE_BASE": now})
            if parsed_time:
                formatted_time = parsed_time.strftime("%Y-%m-%d %H:%M:%S")
            else:
                formatted_time = time
        except Exception as e:
            print(f"Could not parse time '{time}': {e}")
            formatted_time = time

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
                "message": f"Could not find location information for '{city}'. Please check spelling or try another city.",
            }

        first_feature = autocompletion_data["features"][0]
        properties = first_feature.get("properties", {})
        country = properties.get("country")
        state = properties.get("state")
        city_name = properties.get("city") or properties.get("county")

        if not state or not city_name:
            return {
                "status": "invalid",
                "message": f"Could not determine state/province for '{city}'. Please be more specific.",
            }

        # Get restaurant data
        # restaurant_data = url_manipulation(city, state, restaurant)

        search_query = f"{restaurant} {city}"
        results = google_places_script(google_api_key, search_query)

        if results and "places" in results:
            print(f"--- Results for '{search_query}' ---")
            result = results["places"][0]

            # Extract directly into separate variables
            name = result.get("displayName", {}).get("text", "")
            phone_number = result.get("nationalPhoneNumber", "")
            address = result.get("formattedAddress", "")
            opening_hours = result.get("regularOpeningHours", {}).get(
                "weekdayDescriptions", []
            )

            # Print the individual variables
            print("Name:", name)
            print("Phone Number:", phone_number)
            print("Address:", address)
            print("Opening Hours:")
            for day in opening_hours:
                print("", day)
        else:
            print("No results found.")
        message = (
            db.query(RestaurantEntry).filter_by(name=name, address=address).first()
        )

        return {
            "status": "valid",
            "message": f"Found information for {restaurant} in {city}, {state} at {formatted_time} for {party_size} people",
            "data": {
                "restaurant": name,
                "address": address,
                "city": city_name,
                "state": state,
                "country": country,
                "party_size": party_size,
                "time": formatted_time,
                "occasion": occasion,
            },
            "Restaurant_info": {
                "name": message.name,
                "address": message.address,
                "Opening_hours": message.hours,
                "logo": message.logo,
            },
        }

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return {
            "status": "error",
            "message": f"An error occurred while processing your request: {str(e)}",
        }
