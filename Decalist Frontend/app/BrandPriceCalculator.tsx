import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
// 
// ############## made by team decadex #############################################
const BrandPriceCalculator = ({
  brandScore,
  engagement,
  currentPremium,
  basePrice,
}: {
  brandScore: number;
  engagement: SocialStats;
  currentPremium: number;
  basePrice: number;
}) => {
  const calculatePriceMultiplier = () => {
    // Brand factor calculation (35% weight)
    const brandFactor = (brandScore / 10) * 0.35;
    // Price position calculation (35% weight)
    const pricePosition =
      Math.min(Math.max(currentPremium / 100, 0.5), 2.0) * 0.35;
    // Engagement score calculation (15% weight)
    const engagementScore =
      (Math.min(engagement.followers / 100000, 1) * 0.4 +
        Math.min(engagement.avg_likes / 1000, 1) * 0.3 +
        Math.min(engagement.avg_comments / 100, 1) * 0.3) *
      0.15;
    // Consistency calculation (15% weight)
    const consistency = (1 - Math.abs(brandFactor - pricePosition)) * 0.15;
    return Number(
      (brandFactor + pricePosition + engagementScore + consistency+1).toFixed(2)
    );
  };

  const [multiplier, setMultiplier] = useState(calculatePriceMultiplier());
  const recommendedPrice = Math.round(basePrice * multiplier);

  const handleSliderChange = (value: number[]) => {
    setMultiplier(value[0]);
  };

  return (
    <Card className="w-full  mx-auto col-span-2">
      <CardHeader>
        <CardTitle>Brand Price Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="mt-1 p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">Results:</div>
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <span>Price Multiplier: {multiplier}x</span>
                <span className="text-sm text-gray-500">
                  (Suggested: {calculatePriceMultiplier()}x)
                </span>
              </div>
              <Slider
                value={[multiplier]}
                onValueChange={handleSliderChange}
                min={0.5}
                max={2.0}
                step={0.01}
                className="my-4"
              />
              <div className="text-xl font-bold mt-2">
                Recommended Price: ₹{recommendedPrice}
              </div>
              <div className="text-xl font-bold mt-2">
                Market Average: ₹{basePrice}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandPriceCalculator;




























// ############## made by team decadex #############################################