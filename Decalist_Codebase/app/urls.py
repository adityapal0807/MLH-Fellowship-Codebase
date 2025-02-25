
from django.urls import path
from .views import InstaParameters, BrandScore, CategoryPrices,PricePremiumAPI

urlpatterns = [
    path('fetch_insta_parameters', InstaParameters.as_view(), name='fetch_insta_parameters'),
    path('fetch_brand_score', BrandScore.as_view(), name='fetch_brand_score'),
    path('fetch_category_prices', CategoryPrices.as_view(), name="fetch_category_prices"),
    path('fetch_pricepremium', PricePremiumAPI.as_view(), name="fetch_price_premium")
]





















































############## made by team decadex #############################################