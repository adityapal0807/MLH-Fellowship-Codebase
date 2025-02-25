"use server";

export async function fetchPricePremium(companyName: string) {
  // testing
  
  // return {
  //   category_analysis: [
  //     {
  //       category: "Graphic Oversized Tshirts",
  //       brand_average_price: 1699.0,
  //       market_average_price: 1123.375,
  //       price_premium_percentage: 51.21531625782085,
  //     },
  //     {
  //       category: "Denim Jeans",
  //       brand_average_price: 1944.0,
  //       market_average_price: 2574.066666666667,
  //       price_premium_percentage: -24.464352221216636,
  //     },
  //     {
  //       category: "Printed Hoodies",
  //       brand_average_price: 1912.3333333333333,
  //       market_average_price: 1899.0,
  //       price_premium_percentage: 0.7022801574512901,
  //     },
  //   ],
  //   overall_price_premium_percentage: 13.84214885610303,
  //   insights: [
  //     "FOREVER 21's pricing strategy shows variation based on category, indicating potential adjustments.",
  //     "Further analysis on cost structure and competitor pricing bands is recommended.",
  //   ],
  // };
  const formData = new FormData();
  formData.append("company_name", companyName);

  const response = await fetch("http://127.0.0.1:8000/fetch_pricepremium", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch price premium data");
  }

  return response.json();
}








































// ############## made by team decadex #############################################