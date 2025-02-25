import httpx
import json
from typing import Dict
from urllib.parse import quote
import jmespath

class InstagramScraper:
    """
    A class to scrape Instagram posts and user profiles.
    """
    INSTAGRAM_DOCUMENT_ID = "8845758582119845"  # Constant ID for post documents on Instagram

    def __init__(self):
        # Initialize the HTTP client with default headers
        self.client = httpx.Client(
            headers={
                "x-ig-app-id": "936619743392459",  # Internal ID of Instagram backend app
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
            }
        )

    def scrape_post(self, url_or_shortcode: str) -> Dict:
        """
        Scrape data from a single Instagram post.

        :param url_or_shortcode: URL or shortcode of the Instagram post
        :return: Dictionary containing the post data
        """
        if "http" in url_or_shortcode:
            shortcode = url_or_shortcode.split("/p/")[-1].split("/")[0]
        else:
            shortcode = url_or_shortcode

        print(f"Scraping Instagram post: {shortcode}")

        variables = quote(json.dumps({
            'shortcode': shortcode,
            'fetch_tagged_user_count': None,
            'hoisted_comment_id': None,
            'hoisted_reply_id': None
        }, separators=(',', ':')))

        body = f"variables={variables}&doc_id={self.INSTAGRAM_DOCUMENT_ID}"
        url = "https://www.instagram.com/graphql/query"

        result = self.client.post(url=url, data=body)
        data = json.loads(result.content)
        return data["data"]["xdt_shortcode_media"]

    def scrape_user(self, username: str) -> Dict:
        """
        Scrape data from an Instagram user's profile.

        :param username: Instagram username
        :return: Dictionary containing the user profile data
        """
        print(f"Scraping Instagram user: {username}")

        result = self.client.get(
            f"https://i.instagram.com/api/v1/users/web_profile_info/?username={username}"
        )
        data = json.loads(result.content)
        return self.parse_user(data["data"]["user"])

    def save_to_file(self, data: Dict, filename: str):
        """
        Save data to a JSON file.

        :param data: Dictionary data to save
        :param filename: Name of the file to save the data
        """
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")

    
    def parse_user(self,data):
        """Parse instagram user's hidden web dataset for user's data"""
        
        result = jmespath.search(
            """{
            name: full_name,
            username: username,
            id: id,
            category: category_name,
            business_category: business_category_name,
            phone: business_phone_number,
            email: business_email,
            bio: biography,
            bio_links: bio_links[].url,
            homepage: external_url,        
            followers: edge_followed_by.count,
            follows: edge_follow.count,
            facebook_id: fbid,
            is_private: is_private,
            is_verified: is_verified,
            profile_image: profile_pic_url_hd,
            video_count: edge_felix_video_timeline.count,
            videos: edge_felix_video_timeline.edges[].node.{
                id: id, 
                title: title,
                shortcode: shortcode,
                thumb: display_url,
                url: video_url,
                views: video_view_count,
                tagged: edge_media_to_tagged_user.edges[].node.user.username,
                captions: edge_media_to_caption.edges[].node.text,
                comments_count: edge_media_to_comment.count,
                comments_disabled: comments_disabled,
                taken_at: taken_at_timestamp,
                likes: edge_liked_by.count,
                location: location.name,
                duration: video_duration
            },
            image_count: edge_owner_to_timeline_media.count,
            images: edge_felix_video_timeline.edges[].node.{
                id: id, 
                title: title,
                shortcode: shortcode,
                src: display_url,
                url: video_url,
                views: video_view_count,
                tagged: edge_media_to_tagged_user.edges[].node.user.username,
                captions: edge_media_to_caption.edges[].node.text,
                comments_count: edge_media_to_comment.count,
                comments_disabled: comments_disabled,
                taken_at: taken_at_timestamp,
                likes: edge_liked_by.count,
                location: location.name,
                accesibility_caption: accessibility_caption,
                duration: video_duration
            },
            saved_count: edge_saved_media.count,
            collections_count: edge_saved_media.count,
            related_profiles: edge_related_profiles.edges[].node.username
        }""",
            data,
        )
        return result

def fetch_parameters(name):
    scraper = InstagramScraper()
    user_data = scraper.scrape_user(name)

    followers=user_data['followers']
    user_posts=user_data['images']
    total_likes=0
    total_comments=0
    for post in user_posts:
        total_likes+=post['likes']
        total_comments+=post['comments_count']


    avg_likes=round(total_likes/len(user_posts))
    avg_comments= round(total_comments/len(user_posts))
    return(followers, avg_likes, avg_comments)















































    
############## made by team decadex #############################################