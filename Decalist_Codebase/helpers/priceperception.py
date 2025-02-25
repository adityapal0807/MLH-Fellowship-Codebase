import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import google.generativeai as genai
import json
from helpers.myntra_category_prices import FashionAssistant
import re
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()


class PricePremium:
    def __init__(self):
        # Initialize the AI model
        self.api_key = os.getenv('GEMINI_API_KEY')
        genai.configure(api_key=self.api_key)
        self.fashion_assist = FashionAssistant()
        self.model = genai.GenerativeModel("gemini-1.5-pro-latest",tools='code_execution',generation_config={"response_mime_type": "application/json"})
        self.categories = ['Tshirts','Pants', 'Dresses', 'Shirts', 'Jackets']
        self.prompt = """
            You are a financial and strategy agent specializing in price benchmarking and market premium analysis. Your goal is to analyze the price premium of a specific brand compared to market competitors across various product categories. You will work iteratively, analyzing, cleaning, and validating data before providing a final output. Ensure the results are statistically accurate and actionable.

            Workflow:

            1. Input Specification:
            - Accept the data after ### DATA of the products and use them

            2. Statistical Analysis:
            - For each category, calculate:
                - Average prices for the brand and market.
                - Price Premium (%) using the formula:
                Price Premium = ((Brand Average Price / Market Average Price) - 1) * 100
            - Compute the Overall Price Premium as a weighted average of category-wise premiums, weighted by the number of products in each category.

            3. Output Requirements:
            - Provide results in a well-defined JSON structure:
            - output should be concise
            ```json
            {
                "category_analysis": [
                {
                    "category": "Category Name",
                    "brand_average_price": 0.0,
                    "market_average_price": 0.0,
                    "price_premium_percentage": 0.0
                },
                ...
                ],
                "overall_price_premium_percentage": 0.0,
                "insights": [
                "Key insight about the pricing strategy",
                "Significant observation from the analysis"
                ]
            }

        """

    def get_metadata(self,brand_name):
        metadata = {}
        for category in self.categories:
            metadata[category] = {}
            url = brand_name + ' ' + category
            print(url)
            products = self.fashion_assist.search_products(url)
            metadata[category][brand_name] = products
            market_products = self.fashion_assist.search_products(category)
            metadata[category]['Markets_Analysis'] = market_products

        self.fashion_assist.close()

        return metadata

    def extract_data(self,response):
        # json_data = str(response).split('###OUTPUT\n')[1].strip().strip('```').strip('json')
        data = json.loads(response)
        return data

    def premium_calculator(self,metadata, brand_name):
        result = self.model.generate_content((self.prompt + f'### DATA, analysis to be done for:{brand_name}' + str(metadata)))
        data = self.extract_data(result.text)
        return data
    

# if __name__ == "__main__":
#     a = PricePremium()
#     metadata = a.get_metadata("Levis")
#     response = a.premium_calculator(metadata=metadata)
    




        
        