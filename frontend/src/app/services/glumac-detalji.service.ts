import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Glumac } from '../models/glumac';
import { Film, Zanr } from '../models/film';
import { GostPocetnaService } from './gost-pocetna.service';

@Injectable({
  providedIn: 'root'
})
export class GlumacDetaljiService {

  constructor(private gostPocetnaService: GostPocetnaService) { }


  // Dobijanje filmova za konkretnog glumca
  getFilmoviZaGlumca(glumacIme: string): Observable<Film[]> {
    return new Observable(observer => {
      this.gostPocetnaService.getAllFilms().subscribe({
        next: (allFilms: Film[]) => {
          const filmovi = allFilms.filter(film =>
            film.glumci.some(glumac =>
              glumac.toLowerCase() === glumacIme.toLowerCase()
            )
          );
          observer.next(filmovi);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  // Izračunavanje statistika za glumca
  getStatistikeGlumca(glumacIme: string): Observable<{
    ukupnoFilmova: number;
    prosecnaOcena: number;
    najcesciZanr: string;
    rasponGodina: string;
    najcesciReziser: string;
  }> {
    return new Observable(observer => {
      this.getFilmoviZaGlumca(glumacIme).subscribe({
        next: (filmovi: Film[]) => {
          if (filmovi.length === 0) {
            observer.next({
              ukupnoFilmova: 0,
              prosecnaOcena: 0,
              najcesciZanr: 'N/A',
              rasponGodina: 'N/A',
              najcesciReziser: 'N/A'
            });
            observer.complete();
            return;
          }

          // Ukupan broj filmova
          const ukupnoFilmova = filmovi.length;

          // Prosečna ocena svih filmova
          let totalOcena = 0;
          let brojOcena = 0;
          filmovi.forEach(film => {
            if (film.ocene && film.ocene.length > 0) {
              const suma = film.ocene.reduce((acc: number, ocena: any) =>
                acc + (ocena.vrednost || 0), 0);
              totalOcena += suma / film.ocene.length;
              brojOcena++;
            }
          });
          const prosecnaOcena = brojOcena > 0 ? totalOcena / brojOcena : 0;

          // Najčešći žanr
          const zanrovi: { [key: string]: number } = {};
          filmovi.forEach(film => {
            film.zanr.forEach(zanr => {
              zanrovi[zanr] = (zanrovi[zanr] || 0) + 1;
            });
          });
          const najcesciZanr = Object.keys(zanrovi).length > 0
            ? Object.entries(zanrovi).sort((a, b) => b[1] - a[1])[0][0]
            : 'N/A';

          // Raspon godina
          const godine = filmovi.map(f => f.godina).sort((a, b) => a - b);
          const rasponGodina = godine.length > 0
            ? `${godine[0]} - ${godine[godine.length - 1]}`
            : 'N/A';

          // Najčešći režiser
          const reziseri: { [key: string]: number } = {};
          filmovi.forEach(film => {
            film.reziser.forEach((rez: string) => {
              reziseri[rez] = (reziseri[rez] || 0) + 1;
            });
          });
          const najcesciReziser = Object.keys(reziseri).length > 0
            ? Object.entries(reziseri).sort((a, b) => b[1] - a[1])[0][0]
            : 'N/A';

          observer.next({
            ukupnoFilmova,
            prosecnaOcena,
            najcesciZanr,
            rasponGodina,
            najcesciReziser
          });
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  // Sortiranje filmova glumca
  sortFilmove(filmovi: Film[], sortBy: 'godina' | 'ocena' | 'naslov' | 'trajanje', ascending: boolean = false): Film[] {
    const sorted = [...filmovi];

    switch (sortBy) {
      case 'godina':
        sorted.sort((a, b) => ascending ? a.godina - b.godina : b.godina - a.godina);
        break;
      case 'ocena':
        sorted.sort((a, b) => {
          const ocenaA = this.getProsecnaOcena(a);
          const ocenaB = this.getProsecnaOcena(b);
          return ascending ? ocenaA - ocenaB : ocenaB - ocenaA;
        });
        break;
      case 'naslov':
        sorted.sort((a, b) => ascending
          ? a.naslov.localeCompare(b.naslov, 'sr')
          : b.naslov.localeCompare(a.naslov, 'sr'));
        break;
      case 'trajanje':
        sorted.sort((a, b) => ascending
          ? a.trajanjeMin - b.trajanjeMin
          : b.trajanjeMin - a.trajanjeMin);
        break;
    }

    return sorted;
  }

  // Filter filmova po žanru
  filterFilmovePoZanru(filmovi: Film[], zanr: string): Film[] {
    if (!zanr || zanr === 'Svi') {
      return filmovi;
    }
    return filmovi.filter(film => film.zanr.map(z => z.toString()).includes(zanr));
  }

  // Helper metoda za prosečnu ocenu filma
  private getProsecnaOcena(film: Film): number {
    if (!film.ocene || film.ocene.length === 0) {
      return 0;
    }
    const suma = film.ocene.reduce((acc: number, ocena: any) =>
      acc + (ocena.vrednost || 0), 0);
    return suma / film.ocene.length;
  }

  // Dobijanje svih žanrova za filmove glumca
  getZanroviZaGlumca(glumacIme: string): Observable<string[]> {
    return new Observable(observer => {
      this.getFilmoviZaGlumca(glumacIme).subscribe({
        next: (filmovi: Film[]) => {
          const zanroviSet = new Set<string>();
          filmovi.forEach(film => {
            film.zanr.forEach(zanr => zanroviSet.add(zanr));
          });
          observer.next(['Svi', ...Array.from(zanroviSet).sort()]);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }
}
