import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Reziser } from '../models/reziser';
import { Film } from '../models/film';
import { ReziserDetaljiService } from '../services/reziser-detalji.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-reziser-detalji',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './reziser-detalji.component.html',
  styleUrl: './reziser-detalji.component.css'
})
export class ReziserDetaljiComponent implements OnInit {
  reziser: Reziser | null = null;
  reziserIme: string = '';
  loading: boolean = true;
  statistike: any = null;
  filmovi: Film[] = [];
  loadingFilmovi: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reziserDetaljiService: ReziserDetaljiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reziserIme = params['ime'];
      this.loadReziserInfo();
    });
  }

  loadReziserInfo(): void {
    this.loading = true;
    this.reziserDetaljiService.getReziserByIme(this.reziserIme).subscribe({
      next: (reziser) => {
        this.reziser = reziser || null;
        this.loading = false;
        if (this.reziser) {
          this.loadStatistike();
          this.loadFilmovi();
        }
      },
      error: (err) => {
        console.error('Greška pri učitavanju režisera:', err);
        this.loading = false;
      }
    });
  }

  loadStatistike(): void {
    this.reziserDetaljiService.getStatistikeRezisera(this.reziserIme).subscribe({
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
    this.reziserDetaljiService.getFilmoviZaRezisera(this.reziserIme).subscribe({
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

  get safeReziser(): Reziser {
    return this.reziser!;
  }

  get safeSocialMedia() {
    return this.reziser?.socialMedia || {};
  }

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

  // Pie Chart Configuration
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#1e293b',
          font: {
            size: 13,
            family: "'Inter', sans-serif"
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fb923c',
        borderWidth: 2,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} filmova (${percentage}%)`;
          }
        }
      }
    }
  };

  get pieChartData(): ChartConfiguration<'pie'>['data'] {
    const distribucija = this.zanrDistribucija;

    return {
      labels: distribucija.map(d => d.zanr),
      datasets: [{
        data: distribucija.map(d => d.broj),
        backgroundColor: [
          '#fb923c', // Orange
          '#f59e0b', // Amber
          '#fbbf24', // Yellow
          '#fcd34d', // Light yellow
          '#fde68a', // Pale yellow
          '#fed7aa', // Peach
          '#fdba74', // Light orange
          '#ffedd5'  // Very light orange
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 15,
        hoverBorderColor: '#fb923c',
        hoverBorderWidth: 4
      }]
    };
  }

  get timelineEvents(): any[] {
    if (!this.reziser) return [];

    const events: any[] = [];

    // Dodaj početak karijere
    if (this.reziser.aktivanOd) {
      events.push({
        godina: this.reziser.aktivanOd,
        tip: 'karijera',
        tekst: `Početak režiserske karijere`,
        ikona: '🎬'
      });
    }

    // Dodaj nagrade sa ekstraktovanim godinama
    this.reziser.nagrade.forEach(nagrada => {
      const godinaMatch = nagrada.match(/\b(19|20)\d{2}\b/);
      if (godinaMatch) {
        const godina = parseInt(godinaMatch[0]);
        events.push({
          godina: godina,
          tip: 'nagrada',
          tekst: nagrada,
          ikona: '🏆'
        });
      }
    });

    // Dodaj značajne filmove (jedan po deceniji)
    const decadeFilms = new Map<number, Film>();
    this.filmovi.forEach(film => {
      const decade = Math.floor(film.godina / 10) * 10;
      if (!decadeFilms.has(decade)) {
        decadeFilms.set(decade, film);
      }
    });

    decadeFilms.forEach(film => {
      const prosecnaOcena = this.getProsecnaOcena(film);
      events.push({
        godina: film.godina,
        tip: 'film',
        tekst: `${film.naslov} (⭐ ${prosecnaOcena.toFixed(1)})`,
        ikona: '🎥'
      });
    });

    // Sortiraj po godini
    return events.sort((a, b) => a.godina - b.godina);
  }

  getProsecnaOcena(film: Film): number {
    if (!film.ocene || film.ocene.length === 0) return 0;
    const suma = film.ocene.reduce((acc: number, ocena: any) => acc + (ocena.ocena || ocena.vrednost || 0), 0);
    return suma / film.ocene.length;
  }

  formatDatum(datum: string): string {
    const date = new Date(datum);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack(): void {
    // Proveri da li je korisnik ulogovan
    const token = localStorage.getItem('loggedUser');
    console.log(token);
    if (token) {
      // Ulogovan korisnik - vrati se na korisnik-pocetna
      this.router.navigate(['/korisnik']);
    } else {
      // Gost - vrati se na gost-pocetna
      this.router.navigate(['/gost']);
    }
  }
}
