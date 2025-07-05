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
import cv2
import numpy as np
import threading
pinecone_api_key = os.environ.get("PINECONE_API_KEY")
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("savr")


load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
menu_cards = Blueprint('menu_cards', __name__)
file_path = "/Users/arfan/Desktop/Cuisine.jpg"
image_urls = [
    "https://images.sirved.com/ChIJ6fQ1DvLzK4gRq6e8dG-jPjQ/5aaa82c5e8c54.jpg",
]

# image_urls = ["https://images.sirved.com/ChIJmz57CmkqK4gRReNqmD9vPnQ/5efe6f0906735.jpg"]



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
                            "text":(
                            "Extract the individual menu items from this image. "
                            "Return a JSON array. Each object should have:\n"
                            "- 'name': the dish name\n"
                            "- 'description': description if available\n"
                            "- 'price': e.g., '$18'\n"
                            "- 'category': if any category headers exist like 'Pasta' or 'Appetizers'\n"
                            "- 'embeddings': the embedding of the dish, keep it empty for now as I will add it later (should be an array)\n\n"
                            "**For sections like 'Lunch Special' or grouped items, split each listed item into its own object.**\n"
                            "**If multiple items are grouped with a single price, apply the same price to each.**\n"
                            "**Also extract any sections listing add-ons or extras (e.g. 'Enhance any Salad with...'), returning them as a separate object with 'type': 'add-on' and a 'text' field.**\n"
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
            print("GPT-4o response could not be parsed as JSON.")
            print(content)
            return []
        return menu_chunks

    except Exception as e:
        print(f"Error processing {image_url}: {e}")
        return []

# def image_to_RAG_chunks_with_retry(image_url, retries=5):
#         print(f"\n🔄 Processing image: {image_url}")
#         chunks = image_to_RAG_chunks(image_url)

#         return chunks  
def process_imagesRags_in_parallel(image_urls, max_workers=80):
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

def embedding_chunks(chunks):
    texts = []
    for chunk in chunks:
        if chunk.get("type") == "add-on":
            text = chunk.get("text", "")
        else:
            text = f"{chunk.get('name', '')} {chunk.get('description', '')} {chunk.get('category', '')} {chunk.get('price', '')}"

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
        print(f"Error embedding chunks: {e}")
        return []


def clean_metadata(metadata):
    # Remove keys with None values or replace with empty string
    return {k: (v if v is not None else "") for k, v in metadata.items()}
    # Or, to remove keys with None values entirely:
    # return {k: v for k, v in metadata.items() if v is not None}



def rag_embeddings(image_urls):
    images = process_imagesRags_in_parallel(image_urls)

    for image in images:
        print("\n Image result:")
        print(image["chunks"])

        embeddings = embedding_chunks(image["chunks"])
        for emb_item in embeddings:
            emb = emb_item["embedding"]
            chunk = emb_item["chunk"]
            chunk["embeddings"] = emb  # Update in-place

        pinecone_records = []

        for i, chunk in enumerate(image["chunks"]):
            record_id = chunk.get("name", chunk.get("text", f"item-{i}"))
            if not record_id:
                print(f"Skipping item {i}: no valid record ID.")
                continue

            embedding = chunk.get("embeddings", [])
            if not embedding:
                print(f"Skipping {record_id}: empty embedding.")
                continue

            try:
                fetched = index.fetch(ids=[record_id])
            except Exception as e:
                print(f"Error fetching {record_id}: {e}")
                continue

            if fetched.vectors:
                print(f"Duplicate found: {record_id}, skipping.")
                continue

            metadata = clean_metadata({k: v for k, v in chunk.items() if k != "embeddings"})

            pinecone_records.append({
                "id": record_id,
                "values": embedding,
                "metadata": metadata
            })

            # Temporary debug: upsert immediately
            if len(pinecone_records) >= 1:
                try:
                    index.upsert(vectors=pinecone_records)
                    print(f"Upserted {len(pinecone_records)} records to Pinecone.")
                except Exception as e:
                    print(f" Upsert failed: {e}")
                pinecone_records = []

        # Final flush
        if pinecone_records:
            try:
                index.upsert(vectors=pinecone_records)
                print(f"Final upsert: {len(pinecone_records)} records.")
            except Exception as e:
                print(f" Final upsert failed: {e}")
