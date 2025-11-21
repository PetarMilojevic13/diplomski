import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Reziser } from '../models/reziser';
import { Film } from '../models/film';
import { GostPocetnaService } from './gost-pocetna.service';

@Injectable({
  providedIn: 'root'
})
export class ReziserDetaljiService {
  private apiUrl = 'http://localhost:8080/api/reziseri';

  constructor(
    private gostPocetnaService: GostPocetnaService,
    private http: HttpClient
  ) { }

  /**
   * Dohvata sve režisere iz baze podataka
   */
  getAllReziseri(): Observable<Reziser[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(reziseri => reziseri.map(r => new Reziser(
        r.ime,
        r.biografija,
        r.profilnaSlika,
        r.datumRodjenja,
        r.mestoRodjenja,
        r.nagrade,
        r.aktivanOd,
        r.aktivanDo,
        r.socialMedia,
        r.zanimljivosti
      ))),
      catchError(error => {
        console.error('Greška pri učitavanju režisera:', error);
        return of([]);
      })
    );
  }

  /**
   * Dohvata režisera po imenu iz baze podataka
   */
  getReziserByIme(ime: string): Observable<Reziser | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${encodeURIComponent(ime)}`).pipe(
      map(r => {
        if (!r) return undefined;
        return new Reziser(
          r.ime,
          r.biografija,
          r.profilnaSlika,
          r.datumRodjenja,
          r.mestoRodjenja,
          r.nagrade,
          r.aktivanOd,
          r.aktivanDo,
          r.socialMedia,
          r.zanimljivosti
        );
      }),
      catchError(error => {
        console.error('Greška pri učitavanju režisera:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Dohvata sve filmove za određenog režisera
   */
  getFilmoviZaRezisera(ime: string): Observable<Film[]> {
    return new Observable(observer => {
      this.gostPocetnaService.getAllFilms().subscribe({
        next: (allFilms: Film[]) => {
          const filmovi = allFilms.filter((film: Film) =>
            film.reziser.some((r: string) => r.toLowerCase() === ime.toLowerCase())
          );
          observer.next(this.sortFilmove(filmovi));
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  /**
   * Izračunava statistike za režisera na osnovu njegovih filmova
   */
  getStatistikeRezisera(ime: string): Observable<any> {
    return new Observable(observer => {
      this.getFilmoviZaRezisera(ime).subscribe({
        next: (filmovi: Film[]) => {
          if (filmovi.length === 0) {
            observer.next(null);
            observer.complete();
            return;
          }

          // Filtriraj samo filmove koji imaju ocene
          const filmoviSaOcenama = filmovi.filter((film: Film) => film.ocene && film.ocene.length > 0);

          // Izračunaj prosečnu ocenu SAMO za filmove koji imaju ocene
          let prosecnaOcena = 0;
          let najuspesnijiFilmTitle = 'N/A';

          if (filmoviSaOcenama.length > 0) {
            const ukupnaOcena = filmoviSaOcenama.reduce((sum: number, film: Film) => {
              const prosekFilma = (film.ocene.reduce((s: number, ocena: any) => s + (ocena.ocena || ocena.vrednost || 0), 0) / film.ocene.length) || 0;
              return sum + prosekFilma;
            }, 0);
            prosecnaOcena = ukupnaOcena / filmoviSaOcenama.length;

            // Pronađi najuspešniji film SAMO među onima koji imaju ocene
            const najuspesnijiFilm = filmoviSaOcenama.reduce((best: Film, film: Film) => {
              const ocenaFilma = film.ocene.reduce((s: number, ocena: any) => s + (ocena.ocena || ocena.vrednost || 0), 0) / film.ocene.length;
              const ocenaBest = best.ocene.reduce((s: number, ocena: any) => s + (ocena.ocena || ocena.vrednost || 0), 0) / best.ocene.length;
              return ocenaFilma > ocenaBest ? film : best;
            }, filmoviSaOcenama[0]);
            najuspesnijiFilmTitle = najuspesnijiFilm.naslov;
          }

          // Pronađi najčešći žanr MEĐU SVIH filmova režisera (ne samo ocenjenih)
          const zanrMap = new Map<string, number>();
          filmovi.forEach((film: Film) => {
            (film.zanr || []).forEach((z: string) => {
              zanrMap.set(z, (zanrMap.get(z) || 0) + 1);
            });
          });
          const najcesciZanr = Array.from(zanrMap.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

          // Pronađi raspon godina
          const godine = filmovi.map((f: Film) => f.godina).sort((a: number, b: number) => a - b);
          const rasponGodina = `${godine[0]} - ${godine[godine.length - 1]}`;

          observer.next({
            ukupnoFilmova: filmovi.length,
            prosecnaOcena: prosecnaOcena,
            najcesciZanr: najcesciZanr,
            najuspesnijiFilm: najuspesnijiFilmTitle,
            rasponGodina: rasponGodina
          });
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  /**
   * Sortira filmove po godini (najnoviji prvo)
   */
  private sortFilmove(filmovi: Film[]): Film[] {
    return filmovi.sort((a, b) => b.godina - a.godina);
  }
}
