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
from concurrent.futures import ThreadPoolExecutor, as_completed
load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
openai_api_key = os.environ.get("OPENAI_API_KEY")
menu_cards = Blueprint('menu_cards', __name__)
image_urls = [
  "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c5e8c54.jpg",
  "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c736763.jpg",
  "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c80ba7c.jpg",
  "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c964228.jpg",
  "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c54bee4.jpg",
  "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c689130.jpg",
]

def image_to_html(image_url):
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
                                "IMPORTANT: Also extract any add-on options, modifiers, or special instructions, "
                                "even if they are in smaller, lighter, italicized, or differently styled text. "
                                "Include these as a separate <div class='menu-addons'> section at the top of the HTML, "
                                "with each add-on or instruction in a <p> tag."
                            )
                        },
                        {
                            "type": "image_url",
                            "image_url": { "url": image_url }
                        }
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
            return [{"url": image_urls[0], "html": future.result()}]
    else:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {executor.submit(image_to_html, url): url for url in image_urls}
            for future in as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    html = future.result()
                    results.append({"url": url, "html": html})
                except Exception as exc:
                    print(f"{url} generated an exception: {exc}")
                    results.append({"url": url, "html": None})
    return results
# results = process_images_in_parallel(image_urls, max_workers=15)
# for result in results:
#         print(f"URL: {result['url']}\nHTML: {result['html']}\n{'-'*40}")

# @menu_cards.route('/extract_menu_html', methods=['POST'])
# def extract_menu_html():
#     return None
# # Testing hard coded values for now
# if __name__ == "__main__":
#     image_urls = [
#         "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c5e8c54.jpg",
#         "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c736763.jpg",
#         "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c80ba7c.jpg",
#         "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c964228.jpg",
#         "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c54bee4.jpg",
#         "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c689130.jpg",
#     ]
#     results = process_images_in_parallel(image_urls, max_workers=15)
#     for result in results:
#         print(f"URL: {result['url']}\nHTML: {result['html']}\n{'-'*40}")