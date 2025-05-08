from bs4 import BeautifulSoup
import requests
from flask import Blueprint


# SCRAPING RESTUARANT DATA FROM SIRVED
url = "https://www.sirved.com/city/waterloo-ontario-canada/all?keyword=Ennios"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')


# Find all restaurant cards
info = []
restuarant_data = {
    "name": [],
    "address": [],
    "hours": [],
    "logo": [],
    "link": []
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
   logo_url = logo.get('data-src')
   restuarant_data["logo"].append(logo_url)


#Find the link 
links = soup.find_all('a', class_="click-overlay")
for link in links:
    if link:
        link_url = link.get('href')
        restuarant_data["link"].append(link_url)

# print(restuarant_data)



# SCRAPING MENU DATA FROM  SIRVED
menu_url  = "https://www.sirved.com/restaurant/waterloo-ontario-canada/ennios-pasta-house/3794/menus"
menu_url = menu_url[:-1]
print(menu_url)
menu_response = requests.get(menu_url, headers=headers)
menu_soup = BeautifulSoup(menu_response.text, 'html.parser')
menu_images = menu_soup.find_all('img', class_="lozad")
for image in menu_images:
    if image:
        image_url = image.get('data-src')
        print(image_url)


