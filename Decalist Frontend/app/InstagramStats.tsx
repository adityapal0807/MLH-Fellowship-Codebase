import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InstagramStats() {
  // const stats = await fetchInstagramStats(companyName)

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Instagram Stats for Zara</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Followers: 10</p>
        <p>Average Likes: 10</p>
        <p>Average Comments: 10</p>
      </CardContent>
    </Card>
  );
}
