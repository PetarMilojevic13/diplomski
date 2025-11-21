import { Injectable } from '@angular/core';
import { Film, Zanr } from '../models/film';
import { Iznajmljivanje } from '../models/iznajmljivanje';
import { isRentalReturned } from '../utils/iznajmljivanje-helper';

interface FilmWithDistance {
  film: Film;
  distance: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor() { }

  /**
   * KNN algoritam za pronalaženje sličnih filmova na osnovu žanrova
   * @param targetFilm Film za koji tražimo slične filmove
   * @param allFilms Svi dostupni filmovi
   * @param k Broj najsličnijih filmova koje vraćamo (default: 5)
   * @returns Niz od k najsličnijih filmova
   */
  getSimilarFilms(targetFilm: Film, allFilms: Film[], k: number = 5): Film[] {
    // Ukloni target film iz liste
    const otherFilms = allFilms.filter(f => f._id !== targetFilm._id);

    // Izračunaj distancu za svaki film
    const filmsWithDistance: FilmWithDistance[] = otherFilms.map(film => ({
      film,
      distance: this.calculateGenreDistance(targetFilm, film)
    }));

    // Sortiraj po distanci (ascending - manji broj = sličniji)
    filmsWithDistance.sort((a, b) => a.distance - b.distance);

    // Vrati prvih K filmova
    return filmsWithDistance.slice(0, k).map(item => item.film);
  }

  /**
   * Izračunava Jaccard Distance između dva filma na osnovu njihovih žanrova
   * Jaccard Distance = 1 - Jaccard Similarity
   * Jaccard Similarity = |A ∩ B| / |A ∪ B|
   *
   * @param film1 Prvi film
   * @param film2 Drugi film
   * @returns Distanca između filmova (0 = identični žanrovi, 1 = potpuno različiti)
   */
  private calculateGenreDistance(film1: Film, film2: Film): number {
    const genres1 = new Set(film1.zanr);
    const genres2 = new Set(film2.zanr);

    // Presek žanrova (A ∩ B)
    const intersection = new Set([...genres1].filter(g => genres2.has(g)));

    // Unija žanrova (A ∪ B)
    const union = new Set([...genres1, ...genres2]);

    // Ako nema žanrova uopšte, maksimalna distanca
    if (union.size === 0) {
      return 1;
    }

    // Jaccard Similarity
    const similarity = intersection.size / union.size;

    // Jaccard Distance
    return 1 - similarity;
  }

  /**
   * Alternativni pristup: Cosine Distance (za buduće proširenje)
   * Može se koristiti ako želimo da uključimo dodatne feature-e (godina, trajanje, itd.)
   */
  private calculateCosineDistance(film1: Film, film2: Film): number {
    // Kreiraj vektor za sve moguće žanrove
    const allGenres = Object.values(Zanr);

    // One-hot encoding za oba filma
    const vector1 = allGenres.map(genre => film1.zanr.includes(genre) ? 1 : 0);
    const vector2 = allGenres.map(genre => film2.zanr.includes(genre) ? 1 : 0);

    // Dot product
    const dotProduct = vector1.reduce((sum: number, val, i) => sum + val * vector2[i], 0);

    // Magnitude
    const magnitude1 = Math.sqrt(vector1.reduce((sum: number, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum: number, val) => sum + val * val, 0));

    // Cosine similarity
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 1; // Maksimalna distanca
    }

    const cosineSimilarity = dotProduct / (magnitude1 * magnitude2);

    // Cosine distance
    return 1 - cosineSimilarity;
  }

  /**
   * Helper metoda za dobijanje procenat sličnosti (za prikaz korisniku)
   * @param film1 Prvi film
   * @param film2 Drugi film
   * @returns Procenat sličnosti (0-100)
   */
  getSimilarityPercentage(film1: Film, film2: Film): number {
    const distance = this.calculateGenreDistance(film1, film2);
    const similarity = 1 - distance;
    return Math.round(similarity * 100);
  }

  /**
   * Personalizovane preporuke za korisnika na osnovu njegove istorije iznajmljivanja
   * Koristi KNN algoritam da pronađe slične filmove koje korisnik NIJE iznajmio
   *
   * @param userRentals Sve rezervacije korisnika (prošle, trenutne, buduće)
   * @param allFilms Svi dostupni filmovi
   * @param k Broj preporuka (default: 3)
   * @returns Niz od k preporučenih filmova (prazan niz ako nema istorije)
   */
  getPersonalizedRecommendations(userRentals: Iznajmljivanje[], allFilms: Film[], k: number = 3): Film[] {
    // 1. Izdvoj samo ZAVRŠENE rezervacije (datum vraćanja je prošao)
    const completedRentals = userRentals.filter(rental => isRentalReturned(rental));

    // 2. Ako korisnik nema NIJEDNU završenu rezervaciju, vrati PRAZAN niz
    // Frontend će prikazati poruku da korisnik nema istoriju
    if (completedRentals.length === 0) {
      return [];
    }

    // 3. Izvuci sve jedinstvene filmove koje je korisnik iznajmio
    const rentedFilmIds = new Set(userRentals.map(rental => rental.film._id).filter((id): id is string => id !== undefined));

    // 4. Filtriraj filmove - ukloni sve što je korisnik već iznajmio
    const unrentedFilms = allFilms.filter(film => film._id && !rentedFilmIds.has(film._id));

    // 5. Ako nema nenajmljenih filmova (korisnik je iznajmio SVE), vrati prazan niz
    if (unrentedFilms.length === 0) {
      return [];
    }

    // 6. Koristi završene rezervacije za analizu
    const rentalsToAnalyze = completedRentals;

    // 7. Ekstraktuj žanrove iz svih iznajmljenih filmova
    const userGenres: Zanr[] = [];
    rentalsToAnalyze.forEach(rental => {
      if (rental.film.zanr) {
        userGenres.push(...rental.film.zanr);
      }
    });

    // 8. Kreiraj "virtuelni profil korisnika" - najpopularniji žanrovi
    const genreFrequency = new Map<Zanr, number>();
    userGenres.forEach(genre => {
      genreFrequency.set(genre, (genreFrequency.get(genre) || 0) + 1);
    });

    // 9. Sortiraj žanrove po frekvenciji (najviše korišćeni žanrovi)
    const sortedGenres = Array.from(genreFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    // 10. Kreiraj "virtuelni film" sa najpopularnijim žanrovima korisnika
    const userProfile: Film = {
      _id: 'user-profile',
      naslov: 'User Profile',
      opis: '',
      poster: '',
      trajanjeMin: 0,
      godina: 0,
      zanr: sortedGenres.slice(0, 5), // Top 5 žanrova korisnika
      reziser: [],
      glumci: [],
      trailerUrl: '', // Prazan trailer URL za virtuelni profil
      ocene: [],
      komentari: [],
      ukupnoKomada: 0,
      cenaDnevno: 0
    };

    // 11. Izračunaj distancu od user profila do svakog nenajmljenog filma
    const filmsWithDistance: FilmWithDistance[] = unrentedFilms.map(film => ({
      film,
      distance: this.calculateGenreDistance(userProfile, film)
    }));

    // 12. Sortiraj po distanci (manji = sličniji korisniku)
    filmsWithDistance.sort((a, b) => a.distance - b.distance);

    // 13. Vrati prvih K filmova
    return filmsWithDistance.slice(0, k).map(item => item.film);
  }

  /**
   * Helper metoda: Pronađi najčešće žanrove u korisnikovoj istoriji
   * @param rentals Rezervacije korisnika
   * @returns Sortirani niz žanrova po frekvenciji
   */
  getMostFrequentGenres(rentals: Iznajmljivanje[]): Zanr[] {
    const genreFrequency = new Map<Zanr, number>();

    rentals.forEach(rental => {
      if (rental.film.zanr) {
        rental.film.zanr.forEach(genre => {
          genreFrequency.set(genre, (genreFrequency.get(genre) || 0) + 1);
        });
      }
    });

    return Array.from(genreFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
  }
}
