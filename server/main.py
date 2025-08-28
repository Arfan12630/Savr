import os
import uuid
from datetime import datetime
from typing import Any

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models import Layout, get_db
from restaurant_scraping.menu_image import menu_image_router
from restaurant_scraping.restaurant_entry import restaurant_entry_router
from restaurant_scraping.scraper import scraper_router
from registration import registration
from login import login
load_dotenv()

app = FastAPI(title="Savr API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scraper_router, tags=["scraper"])
app.include_router(menu_image_router, tags=["menu"])
app.include_router(restaurant_entry_router, tags=["restaurant"])
app.include_router(registration, tags=["registration"])
app.include_router(login, tags=["login"])

class LayoutRequest(BaseModel):
    """Request model for layout data."""

    layout: Any
    restaurant_card_data: Any


class LayoutResponse(BaseModel):
    """Response model for layout data."""

    name: str
    address: str
    chairs: Any
    tables: Any
    created_at: datetime


@app.post("/save-layout")
async def save_layout(data: dict, db: Session = Depends(get_db)):
    """Save restaurant layout to database."""
    try:
        # Add some debug logging
        print(f"Received data: {data}")
        print(f"Data type: {type(data)}")
        print(f"Data keys: {data.keys() if isinstance(data, dict) else 'Not a dict'}")
        
        layout = Layout(
            id=uuid.uuid4(),
            chairs=data["layout"]["chairs"],
            tables=data["layout"]["tables"],
            name=data["restaurantCardData"]["restaurantCardData"]["restaurant"],
            address=data["restaurantCardData"]["restaurantCardData"]["address"],
            created_at=datetime.now(),
        )

        db.add(layout)
        db.commit()
        db.refresh(layout)
        return data
    except Exception as e:
        print(f"Error in save-layout: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/get-layout")
async def get_layout(name: str, address: str, db: Session = Depends(get_db)):
    """Get restaurant layout from database."""
    try:
        layout = db.query(Layout).filter_by(name=name, address=address).first()
        if layout:
            return LayoutResponse(
                name=layout.name,
                address=layout.address,
                chairs=layout.chairs,
                tables=layout.tables,
                created_at=layout.created_at,
            )
        raise HTTPException(status_code=404, detail="No layout found")
    except Exception as e:
        print(f"Error in get-layout: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/auto-assign-tables")
async def auto_assign_tables(
    name: str,
    address: str,
    party_size: int,
    time: str,
    occasion: str,
    db: Session = Depends(get_db),
):
    """Auto-assign tables based on party size and occasion."""
    layout = db.query(Layout).filter_by(name=name, address=address).first()
    if not layout:
        raise HTTPException(status_code=404, detail="No layout found")

    if isinstance(layout.tables, list):
        for table in layout.tables:
            try:
                print(table["maxPartySizeRange"])
                party_size_range = table["maxPartySizeRange"].split("-")
                print(party_size_range)
                if (
                    occasion.lower() in table["description"].lower()
                    and int(party_size) >= int(party_size_range[0])
                    and int(party_size) <= int(party_size_range[1])
                ):
                    print(table["description"])
                    return {
                        "id": layout.id,
                        "name": layout.name,
                        "address": layout.address,
                        "tables": table,
                        "created_at": layout.created_at,
                    }
            except (KeyError, ValueError, IndexError) as e:
                print(f"Error processing table: {e}")
                continue

        return {"message": "Let User choose own table"}
    else:
        table = layout.tables
        try:
            party_size_range = table["maxPartySizeRange"].split("-")
            if (
                occasion.lower() in table["description"].lower()
                and int(party_size) >= int(party_size_range[0])
                and int(party_size) <= int(party_size_range[1])
            ):
                return {
                    "id": layout.id,
                    "name": layout.name,
                    "address": layout.address,
                    "tables": table,
                    "created_at": layout.created_at,
                }
        except (KeyError, ValueError, IndexError):
            pass

        return {"message": "Let User choose own table"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
