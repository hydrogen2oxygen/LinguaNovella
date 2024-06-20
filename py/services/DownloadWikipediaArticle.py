import requests

# Der Titel des Wikipedia-Artikels, den Sie als reinen Text herunterladen möchten
article_title = "Python (programming language)"

# URL für die Wikipedia API, um die Seite als reinen Text zu erhalten
url = f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&format=json&titles={article_title}"

response = requests.get(url)
data = response.json()

# Extrahieren des Textinhalts aus der API-Antwort
pages = data['query']['pages']
page = next(iter(pages.values()))  # Den ersten (und einzigen) Eintrag im 'pages'-Dikt erhalten
text = page['extract']

print(text)
