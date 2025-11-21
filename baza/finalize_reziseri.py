import json

# Učitaj trenutni JSON fajl
with open('diplomski.films.updated.json', 'r', encoding='utf-8') as f:
    filmovi = json.load(f)

print("Konvertovanje režisera iz stringa u niz stringova...\n")

filmovi_sa_vise_rezisera = []

# Konvertuj reziser polje iz string u niz stringova
for film in filmovi:
    reziser_str = film.get('reziser', '')
    
    if reziser_str:
        # Podeli po zarezu ako ima više režisera
        # Npr: "Anthony Russo, Joe Russo" -> ["Anthony Russo", "Joe Russo"]
        reziseri = [r.strip() for r in reziser_str.split(',')]
        film['reziser'] = reziseri
        
        if len(reziseri) > 1:
            filmovi_sa_vise_rezisera.append(film['naslov'])
            print(f"Film: {film['naslov']}")
            print(f"  Režiseri: {reziseri}\n")
    else:
        film['reziser'] = []

# Sačuvaj ažurirane filmove
with open('diplomski.films.final.json', 'w', encoding='utf-8') as f:
    json.dump(filmovi, f, ensure_ascii=False, indent=2)

print(f"\n✅ Konvertovano {len(filmovi)} filmova")
print(f"✅ Sačuvano u 'diplomski.films.final.json'")
print(f"✅ Filmova sa više režisera: {len(filmovi_sa_vise_rezisera)}")

if filmovi_sa_vise_rezisera:
    print(f"\nFilmovi sa više režisera:")
    for naslov in filmovi_sa_vise_rezisera:
        print(f"  - {naslov}")

# Izbroj sve jedinstvene režisere
svi_reziseri = set()
for film in filmovi:
    for reziser in film.get('reziser', []):
        svi_reziseri.add(reziser)

print(f"\n✅ Ukupno jedinstvenih režisera: {len(svi_reziseri)}")

# Sačuvaj listu jedinstvenih režisera
reziseri_sorted = sorted(list(svi_reziseri))
with open('jedinstveni_reziseri_lista.txt', 'w', encoding='utf-8') as f:
    f.write("LISTA SVIH JEDINSTVENIH REŽISERA\n")
    f.write("=" * 50 + "\n\n")
    for i, rez in enumerate(reziseri_sorted, 1):
        # Brojimo koliko filmova je režirao
        broj_filmova = sum(1 for film in filmovi if rez in film.get('reziser', []))
        f.write(f"{i}. {rez} ({broj_filmova} film{'a' if broj_filmova != 1 else ''})\n")
        
print("✅ Lista jedinstvenih režisera sačuvana u 'jedinstveni_reziseri_lista.txt'")
