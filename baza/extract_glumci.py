import json
from datetime import datetime

# Učitaj filmove iz JSON fajla
with open('diplomski.films.json', 'r', encoding='utf-8') as f:
    filmovi = json.load(f)

# Set za jedinstvena imena glumaca
jedinstveni_glumci = set()

# Skupi sve glumce iz svih filmova
for film in filmovi:
    if 'glumci' in film and isinstance(film['glumci'], list):
        for glumac in film['glumci']:
            if glumac and glumac.strip():  # Proveri da nije prazan string
                jedinstveni_glumci.add(glumac.strip())

# Sortiraj abecedno
sortirani_glumci = sorted(jedinstveni_glumci)

print(f"Pronađeno {len(sortirani_glumci)} jedinstvenih glumaca:")
print("-" * 60)

# Kreiraj listu objekata glumaca
glumci_objekti = []

for ime in sortirani_glumci:
    glumac_obj = {
        "ime": ime,
        "biografija": "",
        "datumRodjenja": None,
        "mestoRodjenja": "",
        "profilnaSlika": "",
        "nagrade": [],
        "aktivanOd": None,
        "aktivanDo": None,
        "socialMedia": {
            "imdb": "",
            "rottenTomatoes": ""
        },
        "zanimljivosti": []
    }
    glumci_objekti.append(glumac_obj)
    print(f"{len(glumci_objekti)}. {ime}")

# Sačuvaj u JSON fajl
output_filename = 'diplomski.glumci.json'
with open(output_filename, 'w', encoding='utf-8') as f:
    json.dump(glumci_objekti, f, ensure_ascii=False, indent=2)

print("-" * 60)
print(f"\n✅ Uspešno kreirano {len(glumci_objekti)} glumaca!")
print(f"📁 Fajl sačuvan kao: {output_filename}")
print(f"\nPrvih 10 glumaca:")
for i, glumac in enumerate(glumci_objekti[:10], 1):
    print(f"  {i}. {glumac['ime']}")
