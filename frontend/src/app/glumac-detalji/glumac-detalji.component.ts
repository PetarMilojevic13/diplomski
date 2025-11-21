import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Glumac } from '../models/glumac';
import { Film } from '../models/film';
import { GlumacService } from '../services/glumac.service';

@Component({
  selector: 'app-glumac-detalji',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './glumac-detalji.component.html',
  styleUrl: './glumac-detalji.component.css'
})
export class GlumacDetaljiComponent implements OnInit {
  glumacIme: string = '';
  glumac: Glumac | null = null;
  loading: boolean = true;
  statistike: any = null;
  filmovi: Film[] = [];
  loadingFilmovi: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private glumacService: GlumacService
  ) {}

  ngOnInit(): void {
    const ime = this.route.snapshot.paramMap.get('ime');
    if (ime) {
      this.glumacIme = decodeURIComponent(ime);
      this.loadGlumacInfo();
    }
  }

  loadGlumacInfo(): void {
    this.glumacService.getGlumacByIme(this.glumacIme).subscribe({
      next: (glumac) => {
        this.glumac = glumac || null;
        this.loading = false;

        // Učitaj statistike i filmove
        if (this.glumac) {
          this.loadStatistike();
          this.loadFilmovi();
        }
      },
      error: (err) => {
        console.error('Greška pri učitavanju glumca:', err);
        this.loading = false;
      }
    });
  }

  loadStatistike(): void {
    this.glumacService.getStatistikeGlumca(this.glumacIme).subscribe({
      next: (stats) => {
        this.statistike = stats;
      },
      error: (err) => {
        console.error('Greška pri učitavanju statistika:', err);
      }
    });
  }

  loadFilmovi(): void {
    this.loadingFilmovi = true;
    this.glumacService.getFilmoviZaGlumca(this.glumacIme).subscribe({
      next: (filmovi) => {
        this.filmovi = filmovi;
        this.loadingFilmovi = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju filmova:', err);
        this.loadingFilmovi = false;
      }
    });
  }

  goBack(): void {
    const token = localStorage.getItem('loggedUser');
    if (token) {
      // Ulogovan korisnik - vrati se nazad u istoriji
      window.history.back();
    } else {
      // Gost - idi na početnu stranicu za goste
      this.router.navigate(['/gost']);
    }
  }

  formatDatum(datum: Date | undefined): string {
    if (!datum) return 'N/A';
    const d = new Date(datum);
    const opcije: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('sr-RS', opcije);
  }

  // Helper getter za bezbedno pristupanje glumcu
  get safeGlumac(): Glumac {
    return this.glumac!;
  }

  // Helper za social media
  get safeSocialMedia() {
    return this.glumac?.socialMedia || {};
  }

  // Distribucija žanrova za grafikon
  get zanrDistribucija(): { zanr: string; broj: number; procenat: number }[] {
    if (!this.filmovi || this.filmovi.length === 0) return [];

    // Broj filmova po žanru
    const zanrMap = new Map<string, number>();
    this.filmovi.forEach((film: Film) => {
      film.zanr.forEach((z: string) => {
        zanrMap.set(z, (zanrMap.get(z) || 0) + 1);
      });
    });

    // Ukupan broj svih žanrova (film može imati više žanrova)
    const ukupnoZanrova = Array.from(zanrMap.values()).reduce((sum, count) => sum + count, 0);

    // Konvertuj u niz i sortiraj po broju
    const distribucija = Array.from(zanrMap.entries())
      .map(([zanr, broj]) => ({
        zanr,
        broj,
        procenat: (broj / ukupnoZanrova) * 100
      }))
      .sort((a, b) => b.broj - a.broj)
      .slice(0, 8); // Prikaži top 8 žanrova

    return distribucija;
  }

  // Helper za timeline events (nagrade i filmovi)
  get timelineEvents(): any[] {
    if (!this.glumac) return [];

    const events: any[] = [];

    // Dodaj početak karijere
    if (this.glumac.aktivanOd) {
      events.push({
        godina: this.glumac.aktivanOd,
        tip: 'karijera',
        tekst: 'Početak karijere',
        ikona: '🎬'
      });
    }

    // Dodaj nagrade
    if (this.glumac.nagrade && this.glumac.nagrade.length > 0) {
      this.glumac.nagrade.forEach(nagrada => {
        // Pokušaj izvući godinu iz teksta nagrade (npr. "Oscar 2016")
        const godinaMatch = nagrada.match(/\b(19|20)\d{2}\b/);
        if (godinaMatch) {
          events.push({
            godina: parseInt(godinaMatch[0]),
            tip: 'nagrada',
            tekst: nagrada,
            ikona: '🏆'
          });
        }
      });
    }

    // Dodaj značajne filmove (po decenijama)
    if (this.filmovi && this.filmovi.length > 0) {
      // Grupiši filmove po decenijama i uzmi po jedan
      const decadeFilms = new Map<number, Film>();
      this.filmovi.forEach(film => {
        const decade = Math.floor(film.godina / 10) * 10;
        if (!decadeFilms.has(decade)) {
          decadeFilms.set(decade, film);
        }
      });

      decadeFilms.forEach(film => {
        events.push({
          godina: film.godina,
          tip: 'film',
          tekst: film.naslov,
          ikona: '🎥'
        });
      });
    }

    // Sortiraj po godinama
    return events.sort((a, b) => a.godina - b.godina);
  }

  getProsecnaOcena(film: Film): number {
    if (!film.ocene || film.ocene.length === 0) return 0;
    const suma = film.ocene.reduce((acc: number, ocena: any) => acc + (ocena.ocena || ocena.vrednost || 0), 0);
    return Math.round((suma / film.ocene.length) * 10) / 10;
  }
}
