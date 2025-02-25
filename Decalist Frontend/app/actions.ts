"use server";

interface BrandInfo {
  popularity: number;
  perception: number;
  priceTier: "budget" | "mid-range" | "premium" | "luxury";
}

export async function analyzeImage(formData: FormData) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Simulate feature extraction
  const features = [
    "T-shirt",
    "Oversized",
    "Cotton",
    "Graphic print",
    "Vintage wash",
    "Limited edition",
  ];

  // Simulate brand info API call
  const brandInfo: BrandInfo = {
    popularity: Math.random() * 100,
    perception: Math.random() * 100,
    priceTier: ["budget", "mid-range", "premium", "luxury"][
      Math.floor(Math.random() * 4)
    ] as BrandInfo["priceTier"],
  };

  // Generate a random price between $10 and $200
  const price = Math.floor(Math.random() * 190) + 10;

  return {
    features,
    brandInfo,
    price: price.toFixed(2),
  };
}

export async function fetchCategoryPrices(formData: FormData) {
  // testing
  
  // return {
  //   avg_price: 819,
  //   prices: [
  //     299, 849, 799, 949, 517, 1497, 549, 299, 475, 527, 599, 969, 1799, 961,
  //     1199,
  //   ],
  //   keywords: ["t-shirt", "orange", "graphic`"],
  // };
  console.log(formData);
  const response = await fetch("http://127.0.0.1:8000/fetch_category_prices", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch price premium data");
  }

  return response.json();
}












































// ############## made by team decadex #############################################
