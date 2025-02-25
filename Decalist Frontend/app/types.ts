type CategoryAnalysis = {
  category: string;
  brand_average_price: number;
  market_average_price: number;
  price_premium_percentage: number;
};

type PricingData = {
  category_analysis: CategoryAnalysis[];
  overall_price_premium_percentage: number;
  insights: string[];
};

interface SocialStats {
  followers: number;
  avg_likes: number;
  avg_comments: number;
}
