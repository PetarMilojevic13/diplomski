import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private apiUrl = 'http://localhost:8080/api/films';

  constructor(private http: HttpClient) { }

  /**
   * Get film by ID
   */
  getFilmById(id: string): Observable<Film> {
    return this.http.get<{ success: boolean, data: Film }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get all films
   */
  getAllFilms(): Observable<Film[]> {
    return this.http.get<{ success: boolean, count: number, data: Film[] }>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Search films by title
   */
  searchFilms(query: string): Observable<Film[]> {
    return this.http.get<{ success: boolean, count: number, data: Film[] }>(`${this.apiUrl}/pretraga?q=${encodeURIComponent(query)}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get films by genre
   */
  getFilmsByGenre(zanr: string): Observable<Film[]> {
    return this.http.get<{ success: boolean, count: number, data: Film[] }>(`${this.apiUrl}/zanr/${encodeURIComponent(zanr)}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get similar films using KNN algorithm (AI recommendations)
   */
  getSimilarFilms(filmId: string, limit: number = 6): Observable<Film[]> {
    return this.http.get<{ success: boolean, count: number, data: Film[] }>(`${this.apiUrl}/${filmId}/slicni?limit=${limit}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Add rating to film
   */
  addRating(filmId: string, korisnikId: string, ocena: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${filmId}/ocene`, {
      korisnikId,
      ocena
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add comment to film
   */
  addComment(filmId: string, korisnikId: string, tekst: string, ocena?: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${filmId}/komentari`, {
      korisnikId,
      tekst,
      ocena
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Rent a film
   */
  rentFilm(filmId: string, korisnikId: string, datumPocetka: Date, datumZavrsetka: Date): Observable<any> {
    return this.http.post(`${this.apiUrl}/${filmId}/iznajmi`, {
      korisnikId,
      datumPocetka,
      datumZavrsetka
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Check if film is available for rental
   */
  checkAvailability(filmId: string): Observable<{ available: boolean, count: number }> {
    return this.http.get<{ available: boolean, count: number }>(`${this.apiUrl}/${filmId}/dostupnost`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get films by director
   */
  getFilmsByDirector(reziser: string): Observable<Film[]> {
    return this.http.get<{ success: boolean, count: number, data: Film[] }>(`${this.apiUrl}/reziser/${encodeURIComponent(reziser)}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get films by actor
   */
  getFilmsByActor(glumac: string): Observable<Film[]> {
    return this.http.get<{ success: boolean, count: number, data: Film[] }>(`${this.apiUrl}/glumac/${encodeURIComponent(glumac)}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get top rated films
   */
  getTopRatedFilms(limit: number = 10): Observable<Film[]> {
    return this.http.get<{ success: boolean, count: number, data: Film[] }>(`${this.apiUrl}/top-rated?limit=${limit}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get newest films
   */
  getNewestFilms(limit: number = 10): Observable<Film[]> {
    return this.http.get<{ success: boolean, count: number, data: Film[] }>(`${this.apiUrl}/newest?limit=${limit}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Create new film (admin only)
   */
  createFilm(filmData: Film): Observable<Film> {
    return this.http.post<{ success: boolean, message: string, data: Film }>(this.apiUrl, filmData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Update film (admin only)
   */
  updateFilm(id: string, filmData: Partial<Film>): Observable<Film> {
    return this.http.put<{ success: boolean, message: string, data: Film }>(`${this.apiUrl}/${id}`, filmData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Delete film (admin only)
   */
  deleteFilm(id: string): Observable<{ success: boolean, message: string }> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Došlo je do greške';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Greška: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Greška ${error.status}: ${error.error?.message || error.message}`;
    }

    console.error('FilmService error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
