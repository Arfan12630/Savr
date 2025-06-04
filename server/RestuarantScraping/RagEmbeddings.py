from flask import Blueprint, jsonify, request
from openai import OpenAI
import os 
from dotenv import load_dotenv
import json
from flask_cors import CORS
import base64
import requests
from requests.structures import CaseInsensitiveDict
from concurrent.futures import ThreadPoolExecutor, as_completed
import time 
import re
from pinecone import Pinecone

# pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
# index = pc.Index("savr")


load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
menu_cards = Blueprint('menu_cards', __name__)

image_urls = [
    "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c5e8c54.jpg",
]

def clean_json_string(content):
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
                            ),
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url}
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
        return menu_chunks

    except Exception as e:
        print(f"❌ Error processing {image_url}: {e}")
        return []

def image_to_RAG_chunks_with_retry(image_url, retries=5):
    for attempt in range(1, retries + 1):
        print(f"\n🔄 Attempt {attempt} for image: {image_url}")
        chunks = image_to_RAG_chunks(image_url)
        if any(chunk.get("position") not in [None, "", []] for chunk in chunks if chunk.get("type") != "add-on"):
            return chunks
        print("⚠️ No positions found, retrying...")
    return chunks  # return last attempt if all failed

def embedding_chunks(chunks):
    texts = []
    for chunk in chunks:
        if chunk.get("type") == "add-on":
            text = chunk.get("text", "")
        else:
            text = f"{chunk.get('name', '')} {chunk.get('description', '')} {chunk.get('category', '')} {chunk.get('price', '')} {chunk.get('position', '')}"
        texts.append(text.strip())

    try:
        embedding_response = client.embeddings.create(
            input=texts,
            model="text-embedding-3-small"
        )
        embeddings = [record.embedding for record in embedding_response.data]
        return [
            {"chunk": chunk, "embedding": emb}
            for chunk, emb in zip(chunks, embeddings)
        ]
    except Exception as e:
        print(f"❌ Error embedding chunks: {e}")
        return []

def process_images_in_parallel(image_urls, max_workers=30):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {executor.submit(image_to_RAG_chunks_with_retry, url): url for url in image_urls}
        for future in as_completed(future_to_url):
            url = future_to_url[future]
            try:
                chunks = future.result()
                results.append({"chunks": chunks})
            except Exception as exc:
                print(f"{url} generated an exception: {exc}")
                results.append({ "chunks": []})
    return results

# === Main execution ===
start_time = time.time()
images = process_images_in_parallel(image_urls)
end_time = time.time()
print(f"\n✅ Time taken: {end_time - start_time:.2f} seconds")
print("=== RAW DATA ===\n")

print("=== LOOPED ACCESS ===")
for image in images:
    print("Image:")
    print(image["chunks"])
    embeddings = embedding_chunks(image["chunks"])
    embeddings_results = {}
    for item in embeddings:
        print(item["chunk"]["name"] if "name" in item["chunk"] else "add-on", item["embedding"][:5])
