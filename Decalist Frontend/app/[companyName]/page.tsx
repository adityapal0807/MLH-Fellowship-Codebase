"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Tag,
  BarChart,
  DollarSign,
  Loader,
  Zap,
  Search,
  RefreshCw,
  Instagram,
  UserPlus,
  Heart,
  MessageCircle,
} from "lucide-react";
import { analyzeImage, fetchCategoryPrices } from "../actions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInstagramStats } from "../actions/fetchInstagramStats";
import { fetchPricePremium } from "../actions/fetchPricePremium";
import { helix, quantum, grid } from "ldrs";
import { fetchBrandScore } from "../actions/fetchBrandScore";
import BrandPriceCalculator from "../BrandPriceCalculator";
import { useParams } from "next/navigation";
helix.register();
quantum.register();
grid.register();

interface AnalysisResult {
  features: string[];
  brandInfo: {
    popularity: number;
    perception: number;
    priceTier: "budget" | "mid-range" | "premium" | "luxury";
  };
  price: string;
  instagramCategories: string[];
}

export default function AIClothingPricePredictor() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const params = useParams();
  const companyName = params.companyName as string;
  const [analyzing, setAnalyzing] = useState(false); // <-- controlling the overlay
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [pricingData, setPricingData] = useState<PricingData>({
    category_analysis: [],
    overall_price_premium_percentage: 0,
    insights: [],
  });
  const [categoryPrices, setCategoryPrices] = useState({
    avg_price: 0,
    keywords: [],
    prices: [],
  });
  const [instagramStats, setInstagramStats] = useState<SocialStats>({
    followers: -1,
    avg_likes: -1,
    avg_comments: -1,
  });

  const [brandScoreData, setBrandScoreData] = useState({
    score: -1,
    reason: "",
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);

      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const loaders = [
    <l-grid size="150" speed="1.5" color="white"></l-grid>,
    <l-quantum size="150" speed="1.75" color="white"></l-quantum>,
    <l-helix size="150" speed="2.5" color="white"></l-helix>,
    <l-grid size="150" speed="1.5" color="white"></l-grid>,
  ];

  const loadersText = [
    "Fetching avg product price ",
    "Fetching social engagement parameters",
    "Calculating current price premium",
    "Calculating brand perception score",
  ];

  // 2. Keep track of the current loader
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAnalyze = async () => {
    if (!image) return;

    setAnalyzing(true);
    setResult(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("image", image);
    const formData2 = new FormData();
    if (file) formData2.append("image", file);

    try {
      const analysisResult = await analyzeImage(formData);
      setCurrentIndex(0);
      const analysisResult2 = await fetchCategoryPrices(formData2);

      setCategoryPrices(analysisResult2);
      setCurrentIndex(1);

      const instaStats = await fetchInstagramStats(companyName);
      console.log(instaStats, "instaStats");
      setInstagramStats(instaStats);
      setCurrentIndex(2);

      const pricePremium = await fetchPricePremium(companyName);
      setPricingData(pricePremium);
      setCurrentIndex(3);

      const brandScoreStats = await fetchBrandScore(companyName);
      setBrandScoreData(brandScoreStats);

      setResult({
        ...analysisResult,
        instagramCategories: ["Fashion", "Streetwear", "Vintage", "Luxury"],
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const refreshData = async (section: keyof AnalysisResult) => {
    if (!result) return;

    setAnalyzing(true);
    try {
      const newData = await analyzeImage(new FormData()); // Simulating API call
      setResult((prev) => ({
        ...prev!,
        [section]: newData[section],
      }));
    } catch (error) {
      console.error(`Error refreshing ${section}:`, error);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (analyzing) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [analyzing]);

  // 3. Cycle through loaders every 2 seconds (2,000 ms)

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 pt-20 pb-8 px-8 flex flex-col items-center justify-center">
        <div className="w-full  bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-8">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    {!image && (
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all duration-300 flex flex-col items-center justify-center"
                      >
                        <Upload className="w-12 h-12 mb-4 text-gray-400" />
                        <span className="text-lg text-gray-500">
                          Click to upload an image
                        </span>
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {image && (
                    <div className="relative mb-6 h-full rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt="Uploaded clothing item"
                        className="w-full h-full object-cover"
                      />
                      {/*
                        We already have a mini overlay while analyzing 
                        (on top of the image). This is optional; 
                        you can remove this if you only want the global overlay.
                      */}
                      {analyzing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Loader className="w-12 h-12 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  )}
                  <Button
                    onClick={handleAnalyze}
                    disabled={!image || analyzing}
                    className="w-full py-6 font-semibold"
                  >
                    {analyzing ? (
                      <div className="flex items-center">
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Zap className="mr-2 h-5 w-5" />
                        Analyze Image
                      </div>
                    )}
                  </Button>
                  {image ? (
                    <Button
                      variant={"secondary"}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-6 font-semibold mt-4"
                    >
                      <div className="flex items-center">
                        <Zap className="mr-2 h-5 w-5" />
                        Click to upload a new image
                      </div>
                    </Button>
                  ) : (
                    ""
                  )}
                </CardContent>
              </Card>

              {analyzing && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis in Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress} className="h-2 mb-2" />
                    <p className="text-sm text-gray-500">
                      {progress}% Complete
                    </p>
                  </CardContent>
                </Card>
              )}

              {!analyzing && !result && !image && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold mb-2">
                      AI-Powered Analysis
                    </h2>
                    <p className="text-gray-500">
                      Upload an image of a clothing item and let our AI analyze
                      its features, brand information, and predict its price.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
              {result && (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>Extracted Features</CardTitle>
                      <RefreshCw
                        className="h-4 w-4 text-muted-foreground cursor-pointer"
                        onClick={() => refreshData("features")}
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {categoryPrices.keywords.length > 0 &&
                          categoryPrices.keywords.map((feature, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 capitalize text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {feature}
                            </span>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>Instagram Categories</CardTitle>
                      <RefreshCw
                        className="h-4 w-4 text-muted-foreground cursor-pointer"
                        onClick={() => refreshData("instagramCategories")}
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {instagramStats.followers > 0 && (
                          <>
                            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm flex items-center">
                              <UserPlus className="w-3 h-3 mr-1" />
                              {instagramStats.followers}
                            </span>
                            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {instagramStats.avg_likes}
                            </span>
                            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {instagramStats.avg_comments}
                            </span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>Brand Information</CardTitle>
                      <RefreshCw
                        className="h-4 w-4 text-muted-foreground cursor-pointer"
                        onClick={() => refreshData("brandInfo")}
                      />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {brandScoreData.reason && (
                        <>
                          <div>
                            <span className="font-medium">
                              Brand Score: {brandScoreData.score}
                            </span>
                            <Progress
                              value={brandScoreData.score * 10}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <span className="ml-2 capitalize">
                              {brandScoreData.reason}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>Price Premium Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="">
                        Overall Price Premium:{""}
                        {pricingData.overall_price_premium_percentage.toFixed(
                          2
                        )}
                        %
                      </p>
                      <div className="mt-2">
                        <h4 className="font-semibold">Insights:</h4>
                        <ul className="list-disc pl-5">
                          {pricingData.insights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Predicted Price
                      </CardTitle>
                      <RefreshCw
                        className="h-4 w-4 text-muted-foreground cursor-pointer"
                        onClick={() => refreshData("price")}
                      />
                    </CardHeader>
                    <CardContent>
                      {result.price && (
                        <div className="text-4xl font-bold flex items-center justify-center">
                          <DollarSign className="w-8 h-8 mr-1" />
                          {result.price}
                        </div>
                      )}
                    </CardContent>
                  </Card> */}
                  <BrandPriceCalculator
                    basePrice={categoryPrices.avg_price}
                    engagement={instagramStats}
                    currentPremium={
                      pricingData.overall_price_premium_percentage
                    }
                    brandScore={brandScoreData.score}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 
        GLOBAL OVERLAY LOADER:
        This overlay covers the entire screen when analyzing === true
      */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            key="loader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center flex-col gap-2"
          >
            {loaders[currentIndex]}
            <span className="text-lg text-white ">
              {loadersText[currentIndex]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
