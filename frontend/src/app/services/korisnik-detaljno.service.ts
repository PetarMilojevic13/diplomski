import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Iznajmljivanje } from '../models/iznajmljivanje';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root'
})
export class KorisnikDetaljnoService {
  private apiUrl = 'http://localhost:8080/api/iznajmljivanja';
  private userApiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  // Učitaj sva iznajmljivanja za određenog korisnika
  getIznajmljivanjaByKorisnik(kor_ime: string): Observable<Iznajmljivanje[]> {
    return this.http.get<any>(`${this.apiUrl}/korisnik/${kor_ime}`)
      .pipe(map(response => response.data));
  }

  // Učitaj sva iznajmljivanja (admin)
  getAllIznajmljivanja(): Observable<Iznajmljivanje[]> {
    return this.http.get<any>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  // Otkaži iznajmljivanje - potpuno brisanje
  cancelIznajmljivanje(iznajmljivanjeId: string): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${iznajmljivanjeId}`)
      .pipe(map(response => response.data));
  }

  // Proveri da li postoji preklapanje termina za istog korisnika i isti film
  // Vraća true ako postoji konflikt (aktivno iznajmljivanje u istom periodu)
  checkRentalConflict(korisnikIme: string, filmId: string, startDate: Date, endDate: Date): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/check-conflict`, {
      korisnikIme,
      filmId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }).pipe(map(response => response.data.hasConflict));
  }

  // Dohvati favorite filmove korisnika
  getFavoriteFilms(kor_ime: string): Observable<Film[]> {
    return this.http.get<any>(`${this.userApiUrl}/${kor_ime}/favorites`)
      .pipe(map(response => response.data));
  }

  // Dodaj film u favorite
  addToFavorites(kor_ime: string, filmId: string): Observable<any> {
    return this.http.post<any>(`${this.userApiUrl}/${kor_ime}/favorites/${filmId}`, {});
  }

  // Ukloni film iz favorita
  removeFromFavorites(kor_ime: string, filmId: string): Observable<any> {
    return this.http.delete<any>(`${this.userApiUrl}/${kor_ime}/favorites/${filmId}`);
  }
}
