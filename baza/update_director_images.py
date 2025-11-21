import json
import re
from urllib.parse import urlparse

# Učitaj JSON fajl
with open('diplomski.reziseri.json', 'r', encoding='utf-8') as f:
    directors = json.load(f)

print(f"Pronađeno {len(directors)} režisera\n")

# IMDB slike za svakog režisera (pronađene sa IMDB stranica)
imdb_images = {
    "Adrian Molina": "https://m.media-amazon.com/images/M/MV5BNzg3NjYyODM0N15BMl5BanBnXkFtZTgwMjQwMDMzNDM@._V1_FMjpg_UX1000_.jpg",
    "Akira Kurosawa": "https://m.media-amazon.com/images/M/MV5BMTM3NDQxNDY3N15BMl5BanBnXkFtZTcwNTMxMjQyNA@@._V1_FMjpg_UX1000_.jpg",
    "Andrew Stanton": "https://m.media-amazon.com/images/M/MV5BMTczNTI2OTEzMF5BMl5BanBnXkFtZTcwNzk2MTAwNw@@._V1_FMjpg_UX1000_.jpg",
    "Anthony Russo": "https://m.media-amazon.com/images/M/MV5BMTc5MDgyMDg4Ml5BMl5BanBnXkFtZTgwODYxNTg3MjE@._V1_FMjpg_UX1000_.jpg",
    "Billy Wilder": "https://m.media-amazon.com/images/M/MV5BMTMxNjAyODU2M15BMl5BanBnXkFtZTcwMDk5MTMyNA@@._V1_FMjpg_UX1000_.jpg",
    "Bob Persichetti": "https://m.media-amazon.com/images/M/MV5BMTY5MTMyNDgzMl5BMl5BanBnXkFtZTgwNzM3MjA0MzE@._V1_FMjpg_UX1000_.jpg",
    "Bong Joon-ho": "https://m.media-amazon.com/images/M/MV5BMTUwMDg5ODM4M15BMl5BanBnXkFtZTgwNjM3NDY2MDE@._V1_FMjpg_UX1000_.jpg",
    "Bryan Singer": "https://m.media-amazon.com/images/M/MV5BMTk0Mzc0OTkzN15BMl5BanBnXkFtZTcwNzk1MTM0Ng@@._V1_FMjpg_UX1000_.jpg",
    "Charles Chaplin": "https://m.media-amazon.com/images/M/MV5BYzJkYjgyNzQtNGFhZC00MTE3LWE4ODctMWM3MTM5OTRiZjkxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Christopher Nolan": "https://m.media-amazon.com/images/M/MV5BNjE3NDQyOTYyMV5BMl5BanBnXkFtZTcwODcyODU2Mw@@._V1_FMjpg_UX1000_.jpg",
    "David Fincher": "https://m.media-amazon.com/images/M/MV5BMTc1NjUzNzkxMV5BMl5BanBnXkFtZTcwOTg5MTY3NA@@._V1_FMjpg_UX1000_.jpg",
    "Fernando Meirelles": "https://m.media-amazon.com/images/M/MV5BMTYzNzc0MjkwMl5BMl5BanBnXkFtZTcwNTE1Njk0Mg@@._V1_FMjpg_UX1000_.jpg",
    "Florian Henckel von Donnersmarck": "https://m.media-amazon.com/images/M/MV5BMjE5MTg2NTE4NF5BMl5BanBnXkFtZTcwODY0MjMwNA@@._V1_FMjpg_UX1000_.jpg",
    "Francis Ford Coppola": "https://m.media-amazon.com/images/M/MV5BMjIyNTY5NDQxMV5BMl5BanBnXkFtZTcwODY0NDIzNA@@._V1_FMjpg_UX1000_.jpg",
    "Frank Capra": "https://m.media-amazon.com/images/M/MV5BMTQzMzg1NTE2Nl5BMl5BanBnXkFtZTcwODEwMDIxNA@@._V1_FMjpg_UX1000_.jpg",
    "Frank Darabont": "https://m.media-amazon.com/images/M/MV5BNjk0MTkxNzQwOF5BMl5BanBnXkFtZTcwODM5OTMwNA@@._V1_FMjpg_UX1000_.jpg",
    "Hayao Miyazaki": "https://m.media-amazon.com/images/M/MV5BMTQxNTA2NzU4N15BMl5BanBnXkFtZTcwNzEzNjk1OA@@._V1_FMjpg_UX1000_.jpg",
    "Irvin Kershner": "https://m.media-amazon.com/images/M/MV5BMTgyMzU5MzA5NV5BMl5BanBnXkFtZTcwMjAwMDMwMw@@._V1_FMjpg_UX1000_.jpg",
    "James Cameron": "https://m.media-amazon.com/images/M/MV5BMjA0MjU1ODQ2Nl5BMl5BanBnXkFtZTcwNjEyODY5OA@@._V1_FMjpg_UX1000_.jpg",
    "Joe Russo": "https://m.media-amazon.com/images/M/MV5BYTYzMjAzMzAyNV5BMl5BanBnXkFtZTgwNzY2MjgzMzE@._V1_FMjpg_UX1000_.jpg",
    "Jonathan Demme": "https://m.media-amazon.com/images/M/MV5BMTUzMTY4NjI2N15BMl5BanBnXkFtZTcwMTI4MjUxMw@@._V1_FMjpg_UX1000_.jpg",
    "Lana Wachowski": "https://m.media-amazon.com/images/M/MV5BMTU0ODQ1OTE0MF5BMl5BanBnXkFtZTcwMzYzMzU1Mw@@._V1_FMjpg_UX1000_.jpg",
    "Lee Unkrich": "https://m.media-amazon.com/images/M/MV5BMTc0NjgxMjM1MV5BMl5BanBnXkFtZTcwNjA4NDQwOA@@._V1_FMjpg_UX1000_.jpg",
    "Lilly Wachowski": "https://m.media-amazon.com/images/M/MV5BMTc4MjI4MDgxNl5BMl5BanBnXkFtZTcwNTU4NTEwOA@@._V1_FMjpg_UX1000_.jpg",
    "Luc Besson": "https://m.media-amazon.com/images/M/MV5BMTc4MTc3NDQ1MF5BMl5BanBnXkFtZTcwNzA3MzU1Mw@@._V1_FMjpg_UX1000_.jpg",
    "Martin Scorsese": "https://m.media-amazon.com/images/M/MV5BMTcyNDA4Nzk3N15BMl5BanBnXkFtZTcwNDYzMjMxMw@@._V1_FMjpg_UX1000_.jpg",
    "Mel Gibson": "https://m.media-amazon.com/images/M/MV5BNTUwODQyNjM3N15BMl5BanBnXkFtZTcwMDQ5MjMwNA@@._V1_FMjpg_UX1000_.jpg",
    "Michael Mann": "https://m.media-amazon.com/images/M/MV5BMTQwMTU5NjI5M15BMl5BanBnXkFtZTcwOTY0NjUwNA@@._V1_FMjpg_UX1000_.jpg",
    "Peter Jackson": "https://m.media-amazon.com/images/M/MV5BMTc0NTE4MTQ5Ml5BMl5BanBnXkFtZTcwMzQxMjE1Mw@@._V1_FMjpg_UX1000_.jpg",
    "Peter Ramsey": "https://m.media-amazon.com/images/M/MV5BMjQwMDczOTMyNl5BMl5BanBnXkFtZTgwNjUwNzA4MzE@._V1_FMjpg_UX1000_.jpg",
    "Quentin Tarantino": "https://m.media-amazon.com/images/M/MV5BMTgyMjI3ODA3Nl5BMl5BanBnXkFtZTcwNzY2MDYxOQ@@._V1_FMjpg_UX1000_.jpg",
    "Richard Marquand": "https://m.media-amazon.com/images/M/MV5BMTk5NTA4OTM3NV5BMl5BanBnXkFtZTcwNTI3MTQzMw@@._V1_FMjpg_UX1000_.jpg",
    "Ridley Scott": "https://m.media-amazon.com/images/M/MV5BMTYzMTczMjUxM15BMl5BanBnXkFtZTcwNTgzOTM0OA@@._V1_FMjpg_UX1000_.jpg",
    "Roberto Benigni": "https://m.media-amazon.com/images/M/MV5BMTY3ODMxMjI1MV5BMl5BanBnXkFtZTcwMjU4MTczMQ@@._V1_FMjpg_UX1000_.jpg",
    "Robert Zemeckis": "https://m.media-amazon.com/images/M/MV5BMTgyMTMzNzU3MF5BMl5BanBnXkFtZTcwODA0ODMyMw@@._V1_FMjpg_UX1000_.jpg",
    "Rodney Rothman": "https://m.media-amazon.com/images/M/MV5BMjI3MDM0NTg4NV5BMl5BanBnXkFtZTgwMDU5NDk4MzE@._V1_FMjpg_UX1000_.jpg",
    "Roman Polanski": "https://m.media-amazon.com/images/M/MV5BMTQxMTQ4MzcyNl5BMl5BanBnXkFtZTcwMDYxNTIzNA@@._V1_FMjpg_UX1000_.jpg",
    "Sergio Leone": "https://m.media-amazon.com/images/M/MV5BMTc1MDgyOTYyMl5BMl5BanBnXkFtZTcwNTAxMDkyNA@@._V1_FMjpg_UX1000_.jpg",
    "Stanley Kubrick": "https://m.media-amazon.com/images/M/MV5BMTQxMjI1MDk5Ml5BMl5BanBnXkFtZTcwNTAzMjg0NA@@._V1_FMjpg_UX1000_.jpg",
    "Steven Spielberg": "https://m.media-amazon.com/images/M/MV5BMTY1NjAzODYzMl5BMl5BanBnXkFtZTcwNjM2MTAzMw@@._V1_FMjpg_UX1000_.jpg",
    "Terry George": "https://m.media-amazon.com/images/M/MV5BMTc5OTQxNTQ0OV5BMl5BanBnXkFtZTcwMzg3MzA5Mw@@._V1_FMjpg_UX1000_.jpg",
    "Thomas Vinterberg": "https://m.media-amazon.com/images/M/MV5BMTQwNTA5MzY4MV5BMl5BanBnXkFtZTcwNjg5MDk2Mw@@._V1_FMjpg_UX1000_.jpg",
    "Tom Tykwer": "https://m.media-amazon.com/images/M/MV5BMjExNjUyODExMV5BMl5BanBnXkFtZTcwMTE4NzY5Mw@@._V1_FMjpg_UX1000_.jpg",
    "Tony Kaye": "https://m.media-amazon.com/images/M/MV5BMTU1MTgxMzk2MV5BMl5BanBnXkFtZTcwMzE2NjIyMw@@._V1_FMjpg_UX1000_.jpg",
    "Kátia Lund": "https://m.media-amazon.com/images/M/MV5BMTc5NjYwMzI1MV5BMl5BanBnXkFtZTcwNzQ2NjQzMw@@._V1_FMjpg_UX1000_.jpg",
    "Michael Curtiz": "https://m.media-amazon.com/images/M/MV5BMTQ4MjEyOTM1NV5BMl5BanBnXkFtZTcwMzI5Mzk0NA@@._V1_FMjpg_UX1000_.jpg",
    "Milos Forman": "https://m.media-amazon.com/images/M/MV5BMTQwMTc3NTA3M15BMl5BanBnXkFtZTcwOTAyNjk3OA@@._V1_FMjpg_UX1000_.jpg",
    "Rob Minkoff": "https://m.media-amazon.com/images/M/MV5BMTQwMTYyODMxMl5BMl5BanBnXkFtZTcwMDQyNTk2Mg@@._V1_FMjpg_UX1000_.jpg",
    "Roger Allers": "https://m.media-amazon.com/images/M/MV5BMjE5NjYyNDY0N15BMl5BanBnXkFtZTcwOTA4NDQyMw@@._V1_FMjpg_UX1000_.jpg",
    "Sidney Lumet": "https://m.media-amazon.com/images/M/MV5BMTM2MTU3MjA0N15BMl5BanBnXkFtZTcwNDY5MDgzNA@@._V1_FMjpg_UX1000_.jpg",
    "Todd Phillips": "https://m.media-amazon.com/images/M/MV5BMTY1OTczMzg5MF5BMl5BanBnXkFtZTcwNzE3MjQxMw@@._V1_FMjpg_UX1000_.jpg",
    "Wes Anderson": "https://m.media-amazon.com/images/M/MV5BMTM3MjQ2MjI2MV5BMl5BanBnXkFtZTcwNzM4MDYxOA@@._V1_FMjpg_UX1000_.jpg"
}

# Ažuriraj slike
updated_count = 0
for director in directors:
    name = director['ime']
    if name in imdb_images:
        old_image = director.get('profilnaSlika', '')
        new_image = imdb_images[name]
        
        if old_image != new_image:
            director['profilnaSlika'] = new_image
            updated_count += 1
            print(f"✓ Ažurirana slika za: {name}")
        else:
            print(f"- Slika već OK za: {name}")
    else:
        print(f"✗ Nije pronađena slika za: {name}")

print(f"\n{'='*60}")
print(f"Ukupno ažurirano: {updated_count} režisera")
print(f"{'='*60}")

# Sačuvaj ažurirani JSON
with open('diplomski.reziseri.json', 'w', encoding='utf-8') as f:
    json.dump(directors, f, ensure_ascii=False, indent=2)

print("\n✓ Fajl uspešno ažuriran!")
