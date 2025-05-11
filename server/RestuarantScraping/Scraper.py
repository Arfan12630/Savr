from bs4 import BeautifulSoup
import requests
from flask import Blueprint, jsonify

scraper = Blueprint('scraper', __name__)
#Country will be canada for now
def url_manipulation(address, province, restuarantName,country = "canada"):
    new_url = f"https://www.sirved.com/city/{address}-{province}-{country}/all?keyword={restuarantName}"
    restuarant_data = scrape_restaurant_data(new_url)
    return restuarant_data


def scrape_restaurant_data(url):
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
    links = [a.get('href') for a in soup.find_all('a', class_="click-overlay")]

    restaurants = []
    for i in range(len(names)):
        restaurant = {
            "name": names[i] if i < len(names) else "",
            "address": addresses[i] if i < len(addresses) else "",
            "hours": hours[i] if i < len(hours) else "",
            "logo": logos[i] if i < len(logos) else "",
            "link": links[i] if i < len(links) else "",
            "menu_images": []
        }
        # Scrape menu images for this restaurant
        llurl = "https://www.sirved.com" + restaurant["link"]
        menu_urlss = llurl[:-1]
        menu_response = requests.get(menu_urlss, headers=headers)
        menu_soup = BeautifulSoup(menu_response.text, 'html.parser')
        menu_images = menu_soup.find_all('img', class_="lozad")
        image_urls = []
        for image in menu_images[:-1]:
            image_url = image.get('data-src')
            if image_url:
                image_urls.append(image_url)
        restaurant["menu_images"] = image_urls
        restaurants.append(restaurant)

    return restaurants
restuarants = scrape_restaurant_data("https://www.sirved.com/city/waterloo-ontario-canada/all?keyword=Ennios")
print(restuarants)
#Example usage





@scraper.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    url = "https://www.sirved.com/city/waterloo-ontario-canada/all?keyword=Ennios"
    data = scrape_restaurant_data(url)
    return jsonify(data)


