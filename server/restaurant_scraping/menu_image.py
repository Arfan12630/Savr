import base64
import json
import os

import openai
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request
from openai import OpenAI
from pydantic import BaseModel
from requests.structures import CaseInsensitiveDict
from sqlalchemy.orm import Session

from models import Restaurant, RestaurantEntry, get_db

load_dotenv()

menu_image_router = APIRouter()


class MenuImageRequest(BaseModel):
    """Request model for menu image upload."""

    image_url: str


@menu_image_router.post("/upload-menu-item-image")
async def upload_menu_image(data: MenuImageRequest):
    """Upload menu item image."""
    print("Reached here")
    image_url = data.image_url
    print(image_url[:10])

    return {"message": "Menu image uploaded successfully", "imageUrl": image_url}
