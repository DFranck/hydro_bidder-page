from bs4 import BeautifulSoup, SoupStrainer
from pprint import pprint
import json

with open("response.html", "r") as file:
    html_content = file.read()

# Assuming this HTML content is stored in a variable called 'html_content'
soup = BeautifulSoup(html_content, "html.parser")

coins_by_api_id = {}
coins_by_symbol = {}
# Find all <a> tags with the specified class and href pattern
links = soup.find_all(
    "a",
    class_="tw-flex tw-items-center tw-w-full",
    href=lambda x: x and x.startswith("/en/coins/"),
)

for link in links:
    # Find the first two divs under the link
    divs = link.find_all("div", limit=2)

    if len(divs) >= 2:
        coin_str = divs[0].text.strip() if divs[0] else "N/A"

        name_symbol = coin_str.replace("\n", "").rsplit(" ", 1)
        name = name_symbol[0].strip()
        symbol = name_symbol[1].strip()
        href = link["href"]
        api_id = href.replace("/en/coins/", "")
        if api_id not in coins_by_api_id:
            coins_by_api_id[api_id] = {"name": name, "symbol": symbol}
        if symbol not in coins_by_symbol:
            coins_by_symbol[symbol] = {"name": name, "api_id": api_id}
        # print(name, symbol, href, api_id)
        # print("---")

if not links:
    print("No matching links found")

# pprint(coins)

with open("coins_by_api_id.json", "w") as file:
    json.dump(coins_by_api_id, file)

with open("coins_by_symbol.json", "w") as file:
    json.dump(coins_by_symbol, file)
