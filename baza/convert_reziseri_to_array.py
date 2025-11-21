import json
import re

# Učitaj filmove
with open('diplomski.films.updated.json', 'r', encoding='utf-8') as f:
    filmovi = json.load(f)

print("Konvertovanje režisera u nizove...\n")

# Konvertuj reziser polje iz string u niz
for film in filmovi:
    reziser_str = film.get('reziser', '')
    
    if reziser_str:
        # Podeli po zarezu ako ima više režisera
        # Npr: "Anthony Russo, Joe Russo" -> ["Anthony Russo", "Joe Russo"]
        reziseri = [r.strip() for r in reziser_str.split(',')]
        film['reziser'] = reziseri
        
        if len(reziseri) > 1:
            print(f"Film: {film['naslov']}")
            print(f"  Režiseri: {reziseri}")
    else:
        film['reziser'] = []

# Sačuvaj ažurirane filmove
with open('diplomski.films.reziseri_array.json', 'w', encoding='utf-8') as f:
    json.dump(filmovi, f, ensure_ascii=False, indent=2)

print(f"\n✓ Konvertovano {len(filmovi)} filmova")
print(f"✓ Sačuvano u 'diplomski.films.reziseri_array.json'")

# Izbroj filmove sa više režisera
vise_rezisera = sum(1 for f in filmovi if len(f.get('reziser', [])) > 1)
print(f"✓ Filmova sa više režisera: {vise_rezisera}")

# Prikaži sve jedinstvene režisere
svi_reziseri = set()
for film in filmovi:
    for reziser in film.get('reziser', []):
        svi_reziseri.add(reziser)

print(f"✓ Ukupno jedinstvenih režisera: {len(svi_reziseri)}")

# Sačuvaj listu jedinstvenih režisera
reziseri_sorted = sorted(list(svi_reziseri))
with open('jedinstveni_reziseri_final.txt', 'w', encoding='utf-8') as f:
    for rez in reziseri_sorted:
        # Brojimo koliko filmova je režirao
        broj_filmova = sum(1 for film in filmovi if rez in film.get('reziser', []))
        f.write(f"{rez} ({broj_filmova})\n")
        
print("✓ Lista jedinstvenih režisera sačuvana u 'jedinstveni_reziseri_final.txt'")
