import base64
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import google.generativeai as genai
import json
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()


class FashionAssistant:
    def __init__(self, model_name="gemini-1.5-pro-latest"):
        # Initialize the AI model
        self.model = genai.GenerativeModel(model_name)
        self.api_key = os.getenv('GEMINI_API_KEY')
        genai.configure(api_key=self.api_key)
        
        # Setup Selenium WebDriver
        options = Options()
        # options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Chrome(options=options)
        self.base_url = "https://www.myntra.com/"
    
    def analyze_image(self, image_path):
        """
        Analyze an image and extract fashion keywords.
        """
        with open(image_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode("utf-8")
        
        # Define the prompt for the AI model
        prompt = prompt = """
        ---

        You are a fashion AI assistant analyzing clothing from images. Generate a structured output with the following fields:

        ### **Required fields (must include):**
        - **apparelType**: string  
        - **color**: string  
        - **subcategory/gender**: string

        ### **Optional fields (include when visible, max 1 from each category):**
        - **material**: string (use "unidentifiable" if unclear)  
        - **pattern**: string (use "solid" if none, "unclear" if unsure)  

        ### **Keyword Output Format:**  
        Combine **apparelType**, **color**, and one visible **optional field** (either material or pattern) into a concise string with a maximum of **3 features** for efficient search. The output should be in the format:  
        `apparelType + color + optionalFeature`

        ---

        ### **Examples:**

        **Input 1:**  
        A jacket that appears leather, black in color.  

        **Output:**  
        `jacket + black + leather`

        ---

        **Input 2:**  
        A maxi dress in a floral print.  

        **Output:**  
        `maxi dress + multicolored + floral print`

        ---

        **Input 3:**  
        A white top with long sleeves, fabric texture not visible.  

        **Output:**  
        `top + white + solid`

        ---

        **Guidelines:**
        1. Limit output to **3 features** only, prioritizing **apparelType**, **color**, and the most relevant optional field if required.  
        2. Focus on enhancing search efficiency with broad but meaningful keywords.  
        3. Respond only in the **keyword output format** with no extra details.
        """
        
        # Generate keywords using the model
        result = self.model.generate_content([{'mime_type': 'image/jpeg', 'data': base64_image}, prompt])
        # print(result)
        # print(result.text)
        cleaned_json = result.text.strip("`").replace("```json", "").strip()
        # print(cleaned_json)
        keywords = result.text.strip()
        return cleaned_json
    
    def search_products(self, keywords):
        """
        Search Myntra using extracted keywords and scrape product data.
        """
        search_query = keywords.replace(" + ", " ").replace(" ", "%20")  # Format for URL
        search_url = f"{self.base_url}search?rawQuery={search_query}&sort=popularity"
        
        self.driver.get(search_url)
        self.driver.implicitly_wait(10)
        
        # Get and parse the page source
        soup = BeautifulSoup(self.driver.page_source, "html.parser")
        products = soup.find_all("li", {"class": "product-base"})
        products= products[:15]
        
        metadata = []
        for product in products:
            product_data = {}
            try:
                product_data['product_name'] = product.find('h4', class_='product-product').text
                product_data['brand'] = product.find('h3', class_='product-brand').text
                product_data['price'] = product.find('div', class_='product-price').span.text.strip()
                # product_data['size'] = product.find('span', class_='product-sizeInventoryPresent').text
                # product_data['url'] = self.base_url + product.find('a', href=True)['href']
                # product_data['image_url'] = product.find('img', class_='img-responsive')['src']
            except AttributeError:
                continue  # Skip incomplete product data
            metadata.append(product_data)
        
        return metadata
    
    def close(self):
        """
        Close the WebDriver.
        """
        self.driver.quit()

def calculate_average_price(products):
    total_price = 0
    count = 0
    prices=[]

    for product in products:
        # Extract the numeric price using regex
        price_matches = re.findall(r'\d+', product['price'])
        if price_matches:
            # Use the lowest price in the list
            lowest_price = int(price_matches[0])
            total_price += lowest_price
            prices.append(lowest_price)
            count += 1

    # Calculate average
    avg_price = total_price / count if count > 0 else 0
    return round(avg_price), prices

def fetch_category_prices(image_path):
    assistant = FashionAssistant()


    # image_path = "5.jpg"
    keywords = assistant.analyze_image(image_path)
    print("Extracted Keywords:", keywords)

    # Search products based on keywords
    products = assistant.search_products(keywords)
    avg_price, prices= calculate_average_price(products)

    return avg_price, prices, keywords



























    
############## made by team decadex #############################################