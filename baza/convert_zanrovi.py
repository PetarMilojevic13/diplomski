import json

# Mapa za konverziju žanrova
ZANR_MAPA = {
    # Enum vrednosti -> Srpski
    'AKCIJA': 'Akcija',
    'AVANTURA': 'Avantura',
    'KOMEDIJA': 'Komedija',
    'DRAMA': 'Drama',
    'HOROR': 'Horor',
    'TRILER': 'Triler',
    'NAUCNA_FANTASTIKA': 'Naučna fantastika',
    'FANTAZIJA': 'Fantazija',
    'ROMANSA': 'Romansa',
    'KRIMI': 'Krimi',
    'MISTERIJA': 'Misterija',
    'ANIMIRANI': 'Animirani',
    'BIOGRAFSKI': 'Biografski',
    'RATNI': 'Ratni',
    'VESTERN': 'Vestern',
    'MUZICKI': 'Muzički',
    'PORODICNI': 'Porodični',
    'ISTORIJSKI': 'Istorijski',
    # Engleski -> Srpski
    'Action': 'Akcija',
    'Adventure': 'Avantura',
    'Comedy': 'Komedija',
    'Drama': 'Drama',
    'Horror': 'Horor',
    'Thriller': 'Triler',
    'Sci-Fi': 'Naučna fantastika',
    'Science Fiction': 'Naučna fantastika',
    'Fantasy': 'Fantazija',
    'Romance': 'Romansa',
    'Crime': 'Krimi',
    'Mystery': 'Misterija',
    'Animation': 'Animirani',
    'Biography': 'Biografski',
    'War': 'Ratni',
    'Western': 'Vestern',
    'Music': 'Muzički',
    'Musical': 'Muzički',
    'Family': 'Porodični',
    'History': 'Istorijski',
    # Već srpski (ostaju isti)
    'Akcija': 'Akcija',
    'Avantura': 'Avantura',
    'Komedija': 'Komedija',
    'Horor': 'Horor',
    'Triler': 'Triler',
    'Naučna fantastika': 'Naučna fantastika',
    'Fantazija': 'Fantazija',
    'Romansa': 'Romansa',
    'Krimi': 'Krimi',
    'Misterija': 'Misterija',
    'Animirani': 'Animirani',
    'Biografski': 'Biografski',
    'Ratni': 'Ratni',
    'Vestern': 'Vestern',
    'Muzički': 'Muzički',
    'Porodični': 'Porodični',
    'Istorijski': 'Istorijski'
}

def konvertuj_zanr(zanr):
    """Konvertuje žanr u srpski format"""
    return ZANR_MAPA.get(zanr, zanr)

def main():
    # Učitaj JSON
    with open('diplomski.films.json', 'r', encoding='utf-8') as f:
        filmovi = json.load(f)
    
    # Konvertuj žanrove za svaki film
    for film in filmovi:
        if 'zanr' in film and isinstance(film['zanr'], list):
            # Konvertuj svaki žanr
            novi_zanrovi = [konvertuj_zanr(z) for z in film['zanr']]
            # Ukloni duplikate i zadrži redosled
            seen = set()
            film['zanr'] = [x for x in novi_zanrovi if not (x in seen or seen.add(x))]
    
    # Sačuvaj ažurirani JSON
    with open('diplomski.films.updated.json', 'w', encoding='utf-8') as f:
        json.dump(filmovi, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Konvertovano {len(filmovi)} filmova!")
    print("📁 Novi fajl: diplomski.films.updated.json")
    
    # Prikaži primer
    print("\n📝 Primer konverzije:")
    for i, film in enumerate(filmovi[:3], 1):
        print(f"{i}. {film['naslov']}: {', '.join(film['zanr'])}")

if __name__ == '__main__':
    main()
