import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import duckduckgo_search as ddgs
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# print(os.getenv("API_KEY"))
genai.configure(api_key="")
model = genai.GenerativeModel("gemini-1.5-pro",generation_config={"response_mime_type": "application/json"})


def get_top_searches(query):
    # Create an instance of the DDGS class
    ddg = ddgs.DDGS()

    max_results = 5

    # Perform the search
    results = ddg.text(query, max_results=max_results)

    res=[]
    for r in results:
        # res.append(f'Title: {r["title"]}\nLink: {r["href"]}')
        res.append(
            {
                'title': r['title'],
                'link': r['href']
            }
        )
    return res


class Crawler:
    def __init__(self, url, *args, **kwargs):
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
        self.url = url
        self.headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'}
    
    def get_links(self, url):
        crawled_links=[]
        crawled_links.append(url)
        response = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(response.content, "html.parser")
        links = soup.find_all("a")
        for link in links:
            href = link.get("href")
            if href and not href.startswith("#"):
                absolute_link = urljoin(url, href)
                crawled_links.append(absolute_link)
                if len(crawled_links) > 1:
                    break
        return crawled_links
    
    def get_link_content(self, links):
        output = []
        if len(links)>1:
            links=links[:1]
        
        page_count=0
        for link in links:
            if link.startswith(('http://', 'https://')):
                response = requests.get(link, verify=False, headers=self.headers)
                
                # Set the response encoding to the apparent encoding to avoid encoding issues
                response.encoding = response.apparent_encoding
                
                # Parse the content with BeautifulSoup
                soup = BeautifulSoup(response.content, "html.parser")
                
                # Remove script and style elements to clean up the content
                for script in soup(["script", "style"]):
                    script.extract()
                
                # Get the text from the page and strip leading/trailing whitespaces
                final_text = soup.get_text().strip()
                
                # Remove excessive whitespaces (newlines, tabs, etc.) by replacing them with a single space
                clean_text = re.sub(r'\s+', ' ', final_text)
                
                # Remove unwanted characters like %, �, control characters, but retain alphanumeric and punctuation
                clean_text = re.sub(r'[^\w\s,.!?-]+', '', clean_text)
                
                # Append the cleaned text to the output list, with a page number
                output.append(f'Page {page_count}:\n{clean_text}')
                page_count += 1

        return output
    
    def get_all_site_content(self):
        links=self.get_links(self.url)
        content_list = self.get_link_content(links)
        all_content = "\n".join([text for text in content_list])
        return all_content

def fetch_brand_score(brand):
    res= get_top_searches(f"{brand} clothing reviews amazon flipkart myntra")

    content=''
    for r in res:
        cr=Crawler(r['link'])
        txt= cr.get_all_site_content()
        content+=txt

    # filter
    print("filtering")
    filter_prompt=f'''
    ###System Message: From the provided content , filter out the data which is the brand/product review for the brand:{brand} .
    ###Content: {content}
    '''
    response = model.generate_content(filter_prompt)

    # rating
    brand_rating_prompt=f'''

    ###System Prompt:you have to calculate brand popularity of brand={brand} in India on a scale of 1-10, on the basis of product reviews scrapped and provided. give single definitive ans with reason in well structred simple json . the output should only contain "score" and "reason" feilds only and only.
    ###Content:{response.text}
    '''
    final_res=model.generate_content(brand_rating_prompt)
    return final_res
















































    
############## made by team decadex #############################################