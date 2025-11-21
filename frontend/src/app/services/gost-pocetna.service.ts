
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root'
})
export class GostPocetnaService {
  private backPath = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAllFilms(): Observable<Film[]> {
    return this.http.get<any>(`${this.backPath}/api/films`).pipe(
      map(response => {
        if (response.success && response.data) {
          console.log('Filmovi uspešno preuzeti:', response.count);
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Greška pri preuzimanju filmova:', error);
        return of([]);
      })
    );
  }

  getFilmById(id: string): Observable<Film | null> {
    return this.http.get<any>(`${this.backPath}/api/films/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          console.log('Film uspešno preuzet:', response.data.naslov);
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error('Greška pri preuzimanju filma:', error);
        return of(null);
      })
    );
  }

  // Dodaj ocenu filmu
  addRating(filmId: string, username: string, rating: number): Observable<any> {
    return this.http.post(`${this.backPath}/api/films/${filmId}/ocene/byusername`, {
      korisnik: username,
      vrednost: rating
    });
  }

  // Dodaj komentar filmu
  addComment(filmId: string, username: string, text: string): Observable<any> {
    return this.http.post(`${this.backPath}/api/films/${filmId}/komentari/byusername`, {
      korisnik: username,
      tekst: text
    });
  }

  // Iznajmi film
  rentFilm(filmId: string, username: string, datumPocetka: Date, datumZavrsetka: Date, brojDana: number, ukupnaCena: number, brojKartice: string): Observable<any> {
    return this.http.post(`${this.backPath}/api/films/${filmId}/iznajmi/byusername`, {
      korisnik: username,
      datumPocetka: datumPocetka.toISOString(),
      datumZavrsetka: datumZavrsetka.toISOString(),
      brojDana: brojDana,
      ukupnaCena: ukupnaCena,
      brojKartice: brojKartice
    });
  }
}
