from bs4 import BeautifulSoup
import requests
from flask import Blueprint
url = "https://www.sirved.com/city/waterloo-ontario-canada/all?keyword=Ennios"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

#print(soup.prettify())

# Find all restaurant cards
info = []
restuarant_data = {
    "name": [],
    "address": [],
    "hours": [],
    "logo": []
}

restuarant_titles = soup.find_all('h3', class_="text-truncate")
titles = soup.find_all('h3', class_="text-truncate")
for title in titles:
    if title:
     atag = title.find('a')
    if atag:
     #print(atag.text.strip())
     restuarant_data["name"].append(atag.text.strip())
addresses = soup.find_all('div', class_="res-address")
for address in addresses:
    if address:
        address_lines = address.text.strip().split('\n')
        full_address = ', '.join([line.strip() for line in address_lines if line.strip()])
        restuarant_data["address"].append(full_address)

#print(restuarant_data)

#Opening hours 
hours = soup.find_all('div', class_="res-responce text-truncate open")
for hour in hours:
    if hour:
        hour = hour.text.strip()
        restuarant_data["hours"].append(hour)

#Company Logo
company_logos = soup.find_all('img', class_="visible lozad")
for logo in company_logos:
   print(logo)
   logo_url = logo.get('data-src')
   restuarant_data["logo"].append(logo_url)

print(restuarant_data)