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
import time 
import re

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
openai_api_key = os.environ.get("OPENAI_API_KEY")
menu_cards = Blueprint('menu_cards', __name__)
#  "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c736763.jpg",
#   "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c80ba7c.jpg",
#   "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c964228.jpg",
#   "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c54bee4.jpg",
#   "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c689130.jpg",
image_urls = [
  "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c5e8c54.jpg",
]

def clean_json_string(content):
    # Remove triple backticks and optional 'json' after them
    content = re.sub(r"^```json|^```|```$", "", content.strip(), flags=re.MULTILINE)
    return content.strip()

def image_to_RAG_chunks(image_url):
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
    "Extract the individual menu items from this image. "
    "Return a JSON array. Each object should have:\n"
    "- 'name': the dish name\n"
    "- 'description': description if available\n"
    "- 'price': e.g., '$18'\n"
    "- 'position': coordinates of the text block in the image (if visible)\n"
    "- 'category': if any category headers exist like 'Pasta' or 'Appetizers'\n"
    "**Additionally, extract any sections that list optional add-ons or extras (e.g. 'Enhance any Salad with...') "
    "and return these as a separate object with 'type': 'add-on' and a 'text' field containing the full string of add-ons.**\n"
    "Do NOT hallucinate. Only extract what is visually present."
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

        content = response.choices[0].message.content
        content = clean_json_string(content)
        try:
            menu_chunks = json.loads(content)
        except json.JSONDecodeError:
            print("⚠️ GPT-4o response could not be parsed as JSON.")
            print(content)
            return []

        # for item in menu_chunks:
        #     print("\n📋 Dish:", item.get("name"))
        #     print("📝 Desc:", item.get("description"))
        #     print("💰 Price:", item.get("price"))
        #     print("📍 Coords:", item.get("position"))
        #     print("📂 Category:", item.get("category"))
        #     print("-" * 50)

        return menu_chunks

    except Exception as e:
        print(f"❌ Error processing {image_url}: {e}")
        return []



def process_images_in_parallel(image_urls, max_workers=200):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {executor.submit(image_to_RAG_chunks, url): url for url in image_urls}
        for future in as_completed(future_to_url):
            url = future_to_url[future]
            try:
                chunks = future.result()
                results.append({"chunks": chunks})
            except Exception as exc:
                print(f"{url} generated an exception: {exc}")
                results.append({ "chunks": []})
    return results



start_time = time.time()
images = process_images_in_parallel(image_urls)
end_time = time.time()
print(f"Time taken: {end_time - start_time} seconds")
print("=== RAW DATA ===")
print(images)

print("\n=== LOOPED ACCESS ===")
for image in images:
    print("Image:")
    for i, chunk in enumerate(image["chunks"]):
        print(f"Chunk {i}:")
        print("  Full chunk:", chunk)
        print("  chunk.get('position'):", chunk.get("position"))
        print("  chunk['position'] (direct):", chunk['position'] if 'position' in chunk else 'Key not present')
        print("-" * 30)