"use server";

export async function fetchInstagramStats(companyName: string) {
  console.log(companyName, "companyName");
  // testing
  // return { followers: 62249511, avg_likes: 11591, avg_comments: 131 };

  const formData = new FormData();
  formData.append("company_name", companyName);

  const response = await fetch("http://127.0.0.1:8000/fetch_insta_parameters", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Instagram stats");
  }

  return response.json();
}













































// ############## made by team decadex #############################################