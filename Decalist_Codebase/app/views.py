from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
import tempfile
import os
from helpers.brand_score import fetch_brand_score
import json
from helpers.insta import fetch_parameters
from helpers.myntra_category_prices import fetch_category_prices
from helpers.priceperception import PricePremium

# Create your views here.

class InstaParameters(APIView):

    def post(self, request, *args, **kwargs):

        company_name = request.data.get('company_name', None)
        
        if not company_name:
            return Response({"error": "Name parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        followers, avg_likes, avg_comments= fetch_parameters(company_name)
        response_data={
            'followers':followers,
            'avg_likes':avg_likes,
            'avg_comments':avg_comments
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

class BrandScore(APIView):
    def post(self, request, *args, **kwargs):
        company_name= request.data.get('company_name', None)
        
        if not company_name:
            return Response({"error": "Name parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        brand_score_data= fetch_brand_score(company_name)


        return Response(json.loads(brand_score_data.text), status=status.HTTP_200_OK)

class CategoryPrices(APIView):
    def post(self, request ,*args, **kwargs):
        uploaded_file = request.FILES.get('image', None)
        if not uploaded_file:
            return Response({"error": "Image file is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save the image temporarily
            temp_dir = tempfile.gettempdir()
            temp_file_path = os.path.join(temp_dir, uploaded_file.name)
            
            with open(temp_file_path, 'wb+') as temp_file:
                for chunk in uploaded_file.chunks():
                    temp_file.write(chunk)
            
            # Pass the image path to your handler function
            avg_price, prices, keywords = fetch_category_prices(temp_file_path)
            features = [feature.strip() for feature in keywords.split('+')]

            # Clean up: Remove the temporary file
            os.remove(temp_file_path)
            
            # Return the result
            return Response({'avg_price':avg_price, 'prices':prices, 'keywords':features}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PricePremiumAPI(APIView):
    def post(self, request, *args, **kwargs):
        brand_name = request.data.get('company_name', None)
        premium_agent = PricePremium()
        metadata = premium_agent.get_metadata(brand_name)
        response = premium_agent.premium_calculator(metadata, brand_name)
        return Response(response, status=status.HTTP_200_OK)






    























############## made by team decadex #############################################