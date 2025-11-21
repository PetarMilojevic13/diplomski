import json

# Učitaj filmove
with open('diplomski.films.json', 'r', encoding='utf-8') as f:
    filmovi = json.load(f)

print("📋 Ekstraktovanje jedinstvenih režisera...\n")

# Set za jedinstvene režisere
jedinstveni_reziseri = set()

# Ekstrahovati sve režisere
for film in filmovi:
    reziseri = film.get('reziser', [])
    
    # Ako je reziser string (stari format), konvertuj u listu
    if isinstance(reziseri, str):
        reziseri = [r.strip() for r in reziseri.split(',')]
    
    # Dodaj svakog režisera u set
    for reziser in reziseri:
        if reziser:  # Proveri da nije prazan string
            jedinstveni_reziseri.add(reziser.strip())

# Sortiraj abecedno
sortirani_reziseri = sorted(list(jedinstveni_reziseri))

print(f"✅ Pronađeno {len(sortirani_reziseri)} jedinstvenih režisera\n")

# Kreiraj detaljan izveštaj sa brojem filmova po režiseru
reziseri_sa_filmovima = []
for reziser in sortirani_reziseri:
    filmovi_rezisera = []
    
    for film in filmovi:
        reziseri_filma = film.get('reziser', [])
        
        # Ako je string, konvertuj
        if isinstance(reziseri_filma, str):
            reziseri_filma = [r.strip() for r in reziseri_filma.split(',')]
        
        # Proveri da li ovaj režiser režira ovaj film
        if reziser in reziseri_filma:
            filmovi_rezisera.append(film['naslov'])
    
    reziseri_sa_filmovima.append({
        'ime': reziser,
        'brojFilmova': len(filmovi_rezisera),
        'filmovi': filmovi_rezisera
    })

# Sačuvaj u JSON
with open('jedinstveni_reziseri.json', 'w', encoding='utf-8') as f:
    json.dump(sortirani_reziseri, f, ensure_ascii=False, indent=2)

print(f"✅ Lista sačuvana u 'jedinstveni_reziseri.json'\n")

# Sačuvaj detaljnu verziju sa filmovima
with open('reziseri_sa_filmovima.json', 'w', encoding='utf-8') as f:
    json.dump(reziseri_sa_filmovima, f, ensure_ascii=False, indent=2)

print(f"✅ Detaljna lista sačuvana u 'reziseri_sa_filmovima.json'\n")

# Kreiraj i tekstualnu verziju za pregled
with open('reziseri_lista.txt', 'w', encoding='utf-8') as f:
    f.write("=" * 80 + "\n")
    f.write("LISTA SVIH JEDINSTVENIH REŽISERA\n")
    f.write("=" * 80 + "\n\n")
    
    for i, rez_data in enumerate(reziseri_sa_filmovima, 1):
        f.write(f"{i}. {rez_data['ime']} ({rez_data['brojFilmova']} film{'ova' if rez_data['brojFilmova'] > 1 else ''})\n")
        
        # Ispiši filmove
        for film in rez_data['filmovi']:
            f.write(f"   - {film}\n")
        f.write("\n")

print(f"✅ Tekstualna lista sačuvana u 'reziseri_lista.txt'\n")

# Prikaži prvih 10 režisera sa najviše filmova
print("🎬 TOP 10 REŽISERA SA NAJVIŠE FILMOVA:\n")
top_reziseri = sorted(reziseri_sa_filmovima, key=lambda x: x['brojFilmova'], reverse=True)[:10]

for i, rez in enumerate(top_reziseri, 1):
    print(f"{i}. {rez['ime']} - {rez['brojFilmova']} film{'ova' if rez['brojFilmova'] > 1 else ''}")
    print(f"   Filmovi: {', '.join(rez['filmovi'])}\n")

print("\n" + "=" * 80)
print(f"📊 UKUPNO: {len(sortirani_reziseri)} jedinstvenih režisera")
print("=" * 80)
