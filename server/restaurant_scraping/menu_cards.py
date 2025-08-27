import base64
import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

import openai
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from openai import OpenAI
from requests.structures import CaseInsensitiveDict

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
openai_api_key = os.environ.get("OPENAI_API_KEY")
menu_cards_router = APIRouter()
image_urls = [
    "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c5e8c54.jpg",
]


def image_to_html(image_url):
    """Convert menu image to HTML structure."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Extract this restaurant menu into structured HTML.\n\n"
                                "Use the following HTML structure:\n"
                                "- <div class='menu-category'> for each category section\n"
                                "- <h2> for category headers (e.g., 'Appetizers', 'Lunch Special')\n"
                                "- <div class='menu-item'> for each individual dish\n"
                                "  - <h3> for the dish name\n"
                                "  - <p> for the dish description (if any)\n"
                                "  - <span class='price'> for the price (if any)\n\n"
                                "**Important Instructions:**\n"
                                "1. If a section (e.g., 'Lunch Special' or 'Wrap & Pop') contains multiple dishes in a list or paragraph, "
                                "split each item into its own <div class='menu-item'> block. Use the shared price for each dish if no individual price is given.\n"
                                "2. If there are any add-on sections (e.g., 'Enhance any Salad with:'), wrap them inside "
                                "<div class='menu-addons'> immediately after the corresponding <h2>.\n"
                                "  - Include <h4> for the heading (like 'Enhance...')\n"
                                "  - List each add-on in a separate <p> tag\n"
                                "3. Do not hallucinate text. Only use information that is clearly visible in the image.\n"
                                "4. Skip addresses, hours, or delivery info — only extract the menu.\n\n"
                                "Make sure the final HTML structure reflects one item per dish."
                            ),
                        },
                        {"type": "image_url", "image_url": {"url": image_url}},
                    ],
                }
            ],
            max_tokens=2000,
        )
        print(response.choices[0].message.content)
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error processing {image_url}: {e}")
        return None


def image_to_rag_embeddings(image_url):
    """Convert menu image to RAG embeddings."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Extract this restaurant menu into structured HTML. "
                                "Use <div class='menu-category'> for categories, <h2> for headers, "
                                "<div class='menu-item'> for each dish, <h3> for the name, <p> for description, "
                                "and <span class='price'> for price. "
                                "Preserve structure and avoid hallucinating data. "
                                "IMPORTANT: If any category (e.g. Insalata, Pasta, Antipasti, etc.) contains add-ons, "
                                "place them in a <div class='menu-addons'> immediately after the <h2> of that category. "
                                "Each add-on should go in a <p> tag. "
                                "Only include add-ons near the category they belong to, not at the top."
                            ),
                        },
                        {"type": "image_url", "image_url": {"url": image_url}},
                    ],
                }
            ],
            max_tokens=2000,
        )
        print(response.choices[0].message.content)
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error processing {image_url}: {e}")
        return None


def process_images_in_parallel(image_urls, max_workers=30):
    results = []
    if len(image_urls) == 1:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future = executor.submit(image_to_html, image_urls[0])
            return [{"html": future.result()}]
    else:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {
                executor.submit(image_to_html, url): url for url in image_urls
            }
            for future in as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    html = future.result()
                    results.append({"html": html})
                except Exception as exc:
                    print(f"{url} generated an exception: {exc}")
                    results.append({"html": None})
    return results
