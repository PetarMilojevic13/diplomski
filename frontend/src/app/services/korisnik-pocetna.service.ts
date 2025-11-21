import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Iznajmljivanje } from '../models/iznajmljivanje';

@Injectable({
  providedIn: 'root'
})
export class KorisnikPocetnaService {
  private apiUrl = 'http://localhost:8080/api/iznajmljivanja';

  constructor(private http: HttpClient) { }

  // Get all rentals for a specific user
  getIznajmljivanjaByKorisnik(kor_ime: string): Observable<Iznajmljivanje[]> {
    return this.http.get<any>(`${this.apiUrl}/korisnik/${kor_ime}`).pipe(
      map(response => response.data)
    );
  }

  // Get only active rentals for user
  getAktivnaIznajmljivanja(kor_ime: string): Observable<Iznajmljivanje[]> {
    return this.http.get<any>(`${this.apiUrl}/aktivna/${kor_ime}`).pipe(
      map(response => response.data)
    );
  }

  // Get rental statistics for user
  getStatistikaIznajmljivanja(kor_ime: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistika/${kor_ime}`).pipe(
      map(response => response.data)
    );
  }

  // Create new rental
  createIznajmljivanje(data: {
    kor_ime: string,
    filmId: string,
    brojDana: number,
    cardType: string
  }): Observable<Iznajmljivanje> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map(response => response.data)
    );
  }

  // Return rental
  vratiIznajmljivanje(id: string): Observable<Iznajmljivanje> {
    return this.http.put<any>(`${this.apiUrl}/${id}/vrati`, {}).pipe(
      map(response => response.data)
    );
  }

  // Get all rentals (admin)
  getAllIznajmljivanja(): Observable<Iznajmljivanje[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}

