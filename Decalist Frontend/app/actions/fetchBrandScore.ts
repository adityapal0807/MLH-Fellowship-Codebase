"use server";

export async function fetchBrandScore(companyName: string) {

  // testing
  // return {
  //   score: 7,
  //   reason:
  //     "The provided reviews suggest a moderate level of interest and engagement with the Roadster brand.  Questions about the brand's quality and durability indicate consumer curiosity and a degree of uncertainty. Specific inquiries about different product categories like jeans and shirts imply a level of brand recognition. Review and rating searches further demonstrate an active evaluation process by consumers. While the reviews do not express explicit positive or negative sentiment, the volume of inquiries suggests a moderate level of popularity.",
  // };
  const formData = new FormData();
  formData.append("company_name", companyName);

  const response = await fetch("http://127.0.0.1:8000/fetch_brand_score", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Instagram stats");
  }

  return response.json();
}




















































// ############## made by team decadex #############################################