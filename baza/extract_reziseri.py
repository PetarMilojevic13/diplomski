import json

# Učitaj filmove
with open('diplomski.films.updated.json', 'r', encoding='utf-8') as f:
    filmovi = json.load(f)

# Ekstrahovati jedinstvene režisere
reziseri = set()
for film in filmovi:
    reziser = film.get('reziser', '')
    if reziser:
        reziseri.add(reziser)

# Sortiraj i ispiši
reziseri = sorted(list(reziseri))

print(f"Ukupno jedinstvenih režisera: {len(reziseri)}\n")
for i, reziser in enumerate(reziseri, 1):
    # Brojimo koliko filmova je rezirao
    broj_filmova = sum(1 for f in filmovi if f.get('reziser') == reziser)
    print(f"{i}. {reziser} ({broj_filmova} film{'a' if broj_filmova > 1 else ''})")

# Sačuvaj listu
with open('jedinstveni_reziseri.txt', 'w', encoding='utf-8') as f:
    for reziser in reziseri:
        broj_filmova = sum(1 for film in filmovi if film.get('reziser') == reziser)
        f.write(f"{reziser} ({broj_filmova})\n")

print(f"\nLista sačuvana u 'jedinstveni_reziseri.txt'")
