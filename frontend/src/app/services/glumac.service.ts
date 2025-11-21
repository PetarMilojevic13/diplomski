import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Glumac } from '../models/glumac';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root'
})
export class GlumacService {
  private apiUrl = 'http://localhost:8080/api/glumci';

  constructor(private http: HttpClient) { }

  // Dobijanje svih glumaca
  getAllGlumci(): Observable<Glumac[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}`)
      .pipe(
        map(response => response.data.map(g => this.mapToGlumac(g))),
        catchError(error => {
          console.error('Greška pri učitavanju glumaca:', error);
          throw error;
        })
      );
  }

  // Dobijanje glumca po imenu
  getGlumacByIme(ime: string): Observable<Glumac | undefined> {
    const encodedIme = encodeURIComponent(ime);
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/ime/${encodedIme}`)
      .pipe(
        map(response => response.data ? this.mapToGlumac(response.data) : undefined),
        catchError(error => {
          console.error('Greška pri učitavanju glumca:', error);
          throw error;
        })
      );
  }

  // Dobijanje glumca po ID-u
  getGlumacById(id: string): Observable<Glumac> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => this.mapToGlumac(response.data)),
        catchError(error => {
          console.error('Greška pri učitavanju glumca:', error);
          throw error;
        })
      );
  }

  // Dobijanje filmova za konkretnog glumca
  getFilmoviZaGlumca(glumacIme: string): Observable<Film[]> {
    const encodedIme = encodeURIComponent(glumacIme);
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/${encodedIme}/filmovi`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Greška pri učitavanju filmova glumca:', error);
          throw error;
        })
      );
  }

  // Izračunavanje statistika za glumca
  getStatistikeGlumca(glumacIme: string): Observable<{
    ukupnoFilmova: number;
    prosecnaOcena: number;
    najcesciZanr: string;
    najuspesnijiFilm: string;
    rasponGodina: string;
    najcesciReziser: string;
  }> {
    const encodedIme = encodeURIComponent(glumacIme);
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/${encodedIme}/statistike`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Greška pri učitavanju statistika:', error);
          throw error;
        })
      );
  }

  // Kreiranje novog glumca
  createGlumac(glumac: Partial<Glumac>): Observable<Glumac> {
    return this.http.post<{ success: boolean; data: any }>(`${this.apiUrl}`, glumac)
      .pipe(
        map(response => this.mapToGlumac(response.data)),
        catchError(error => {
          console.error('Greška pri kreiranju glumca:', error);
          throw error;
        })
      );
  }

  // Ažuriranje glumca
  updateGlumac(id: string, glumac: Partial<Glumac>): Observable<Glumac> {
    return this.http.put<{ success: boolean; data: any }>(`${this.apiUrl}/${id}`, glumac)
      .pipe(
        map(response => this.mapToGlumac(response.data)),
        catchError(error => {
          console.error('Greška pri ažuriranju glumca:', error);
          throw error;
        })
      );
  }

  // Brisanje glumca
  deleteGlumac(id: string): Observable<any> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Greška pri brisanju glumca:', error);
          throw error;
        })
      );
  }

  // Pretraga glumaca
  searchGlumci(query: string): Observable<Glumac[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`)
      .pipe(
        map(response => response.data.map(g => this.mapToGlumac(g))),
        catchError(error => {
          console.error('Greška pri pretrazi glumaca:', error);
          throw error;
        })
      );
  }

  // Helper metoda za mapiranje backend objekta u frontend Glumac klasu
  private mapToGlumac(data: any): Glumac {
    return new Glumac(
      data.ime,
      data.biografija || '',
      data.datumRodjenja ? new Date(data.datumRodjenja) : undefined,
      data.mestoRodjenja || '',
      data.profilnaSlika || '',
      data.nagrade || [],
      data.aktivanOd,
      data.aktivanDo,
      data.socialMedia || {},
      data.zanimljivosti || []
    );
  }
}
