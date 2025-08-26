import json
import os
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

import requests
from bs4 import BeautifulSoup
from dateutil import parser as date_parser
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from langchain.chains import LLMChain
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
from requests.structures import CaseInsensitiveDict
from sqlalchemy.orm import Session

from models import RestaurantEntry, get_db
from restaurant_scraping.menu_cards import (image_to_html,
                                            process_images_in_parallel)
from restaurant_scraping.rag_embeddings import (
    embedding_chunks, image_to_rag_chunks, process_images_rags_in_parallel,
    rag_embeddings)
from restaurant_scraping.scraper import google_places_script

# Load .env file
load_dotenv()
restaurant_entry_router = APIRouter()

openai_api_key = os.environ.get("OPENAI_API_KEY")
geography_api_key = os.environ.get("GEOGRAPHY_API_KEY")
google_api_key = os.environ.get("GOOGLE_API_KEY")


class RestaurantEntryRequest(BaseModel):
    """Request model for restaurant entry."""

    restaurant: str
    city: str


# Step 2: Create parser
parser = PydanticOutputParser(pydantic_object=RestaurantEntryRequest)

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
Logo: {logo}
""",
    input_variables=[
        "restaurant",
        "city",
        "current_field",
        "format_instructions",
        "logo",
    ],
)


# Step 4: Initialize LLM and chain
llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=openai_api_key)
chain = LLMChain(llm=llm, prompt=prompt)


def url_maker(city, province, country, restaurant_name):
    """Create URL for restaurant search."""
    print("REACHED URL MAKERS")
    new_url = f"https://www.sirved.com/city/{city}-{province}-{country}/all?keyword={restaurant_name}"
    restaurant_data = scrape_restaurant_data(new_url)
    return restaurant_data


def get_address_info(restaurant, city):
    """Get address information from geography API."""
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
    if city in city_name:
        city_name = city
    print("Altered City name", city)
    if not state or not city_name:
        return {
            "status": "invalid",
            "message": f"Could not determine state/province for '{city}'. Please be more specific.",
        }
    # restaurant_data = url_maker(city, state, country, restaurant)
    address_search_query = f"{restaurant} {city}"

    # Initialize variables with default values
    name = ""
    phone_number = ""
    address = ""
    opening_hours = []

    results = google_places_script(google_api_key, address_search_query)
    if results and "places" in results:
        print(f"--- Results for '{address_search_query}' ---")
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
        # Return error response when no results found
        return {
            "status": "error",
            "message": f"Could not find restaurant '{restaurant}' in {city}. Please check the restaurant name and try again.",
        }

    address_search_info = {
        "name": name,
        "phone_number": phone_number,
        "address": address,
        "opening_hours": opening_hours,
    }
    return address_search_info


def scrape_restaurant_data(url):
    print("REACHED SCRAPE RESTAURANT DATA")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
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
    "logo": "",
    "address": "",
    "opening_hours": "",
}


@restaurant_entry_router.post("/get-address-options")
async def get_address_options(data: dict):
    for field in ["restaurant", "city", "logo"]:
        restaurant_info[field] = data.get(field)
    address_info = get_address_info(
        restaurant_info["restaurant"], restaurant_info["city"]
    )

    # Check if address_info contains an error response
    if address_info.get("status") in ["error", "invalid"]:
        raise HTTPException(status_code=400, detail=address_info)

    restaurant_info["address"] = address_info["address"]
    restaurant_info["restaurant"] = address_info["name"]
    restaurant_info["opening_hours"] = address_info["opening_hours"]
    if all(restaurant_info.values()):
        print("RESTAURANT INFO", restaurant_info)
    result = chain.run(
        restaurant=restaurant_info["restaurant"],
        city=restaurant_info["city"],
        logo=restaurant_info["logo"],
        current_field=field,  # This will be the last field entered
        format_instructions=parser.get_format_instructions(),
    )

    print("\n--- Raw LLM Output ---")
    print(result)
    print("----------------------\n")

    parsed = parser.parse(result)
    return restaurant_info


@restaurant_entry_router.get("/get-address-options")
async def get_address_options_get(
    restaurant: str = None, city: str = None, logo: str = None
):
    """GET version of get-address-options for compatibility"""
    data = {"restaurant": restaurant, "city": city, "logo": logo}
    return await get_address_options(data)


@restaurant_entry_router.post("/upload-logo")
async def upload_logo(data: dict):
    logo = data["logo"]
    if logo:
        restaurant_info["logo"] = logo
        print("RESTAURANT INFO", restaurant_info["logo"][:20])
        return restaurant_info


@restaurant_entry_router.post("/get-address-info")
async def place_in_DB(data: dict, db: Session = Depends(get_db)):
    restaurant_entry = RestaurantEntry(
        id=uuid.uuid4(),
        name=data["restaurant"],
        address=data["address"],
        hours=data["opening_hours"],
        logo=data["logo"],
        created_at=datetime.now(),
        rag_ready=False,
    )
    if (
        db.query(RestaurantEntry)
        .filter_by(name=data["restaurant"], address=data["address"])
        .first()
    ):
        raise HTTPException(
            status_code=400, detail={"message": "Restaurant already exists"}
        )
    db.add(restaurant_entry)
    db.commit()
    return data


@restaurant_entry_router.post("/extract-menu-html")
async def extract_menu_html(data: dict):
    restaurant_data = data["restaurant_data"]
    image_urls = data["image_urls"]
    menu_html = process_images_in_parallel(image_urls)
    # executor = ThreadPoolExecutor(max_workers=10)
    # executor.submit(rag_embeddings, image_urls)
    if not restaurant_data and not image_urls:
        raise HTTPException(
            status_code=400, detail={"message": "No data provided", "status": "error"}
        )

    # Just return the extracted HTML, don't save to DB yet
    response = {
        "menu_html": menu_html,
        "status": "HTML Extracted Successfully, Rag Remaining",
    }  # Assuming single image

    executor = ThreadPoolExecutor(max_workers=10)
    executor.submit(rag_embeddings, image_urls)
    return response


@restaurant_entry_router.post("/save-all-menu-html")
async def save_all_menu_html(data: dict, db: Session = Depends(get_db)):
    restaurant_data = data["restaurant_data"]
    menu_htmls = data["menu_htmls"]  # List of HTML strings

    entry = (
        db.query(RestaurantEntry)
        .filter_by(
            name=restaurant_data["restaurant"], address=restaurant_data["address"]
        )
        .first()
    )

    if not entry:
        raise HTTPException(status_code=404, detail={"message": "Entry not found"})

    # Store as array of strings or concatenate them
    entry.menu_html = menu_htmls  # If your column is ARRAY(Text) or JSON
    entry.rag_ready = True
    # OR concatenate: entry.menu_html = "\n\n".join(menu_htmls)

    db.commit()
    return {"message": "All menu HTMLs saved successfully"}


@restaurant_entry_router.get("/get-all-menu-html")
async def get_all_menu_html(db: Session = Depends(get_db)):
    entry = db.query(RestaurantEntry).filter_by(name="Ennio's Pasta House").first()
    return {"menu_htmls": entry.menu_html}
