import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Film, Zanr, getAllZanrovi } from '../models/film';
import { GostPocetnaService } from '../services/gost-pocetna.service';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-gost-pocetna',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent],
  templateUrl: './gost-pocetna.component.html',
  styleUrl: './gost-pocetna.component.css'
})
export class GostPocetnaComponent implements OnInit {
  films: Film[] = [];
  filteredFilms: Film[] = [];
  loading: boolean = true;

  searchQuery: string = '';
  selectedZanr: string = '';
  sortBy: string = 'naslov';

  allZanrovi: string[] = [];

  constructor(
    private gostPocetnaService: GostPocetnaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    this.loading = true;
    this.gostPocetnaService.getAllFilms().subscribe({
      next: (data: Film[]) => {
        this.films = data;
        this.filteredFilms = [...data];
        this.loadAllZanrovi();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju filmova:', err);
        this.loading = false;
      }
    });
  }

  loadAllZanrovi(): void {
    // Prikupljamo sve jedinstvene žanrove iz filmova u bazi
    const zanroviSet = new Set<string>();

    this.films.forEach(film => {
      if (film.zanr && Array.isArray(film.zanr)) {
        film.zanr.forEach((z: any) => {
          const zanrStr = typeof z === 'string' ? z : String(z);
          zanroviSet.add(zanrStr);
        });
      }
    });

    // Konvertujemo Set u niz i sortiramo
    this.allZanrovi = Array.from(zanroviSet).sort();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onZanrChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.films];

    // Pretraga samo po naslovu filma
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(film =>
        film.naslov.toLowerCase().includes(query)
      );
    }

    // Filter po žanru - prilagođeno za rad sa string nizovima iz baze
    if (this.selectedZanr) {
      result = result.filter(film => {
        // Provera da li film ima žanrove i da li izabrani žanr postoji u nizu
        return film.zanr && film.zanr.some((z: any) => {
          const zanrStr = typeof z === 'string' ? z : String(z);
          return zanrStr === this.selectedZanr;
        });
      });
    }

    // Sortiranje
    result = this.sortFilms(result);

    this.filteredFilms = result;
  }

  sortFilms(films: Film[]): Film[] {
    switch (this.sortBy) {
      case 'naslov':
        return films.sort((a, b) => a.naslov.localeCompare(b.naslov));
      case 'godina-desc':
        return films.sort((a, b) => b.godina - a.godina);
      case 'godina-asc':
        return films.sort((a, b) => a.godina - b.godina);
      case 'trajanje':
        return films.sort((a, b) => a.trajanjeMin - b.trajanjeMin);
      case 'ocena':
        return films.sort((a, b) => this.getProsecnaOcena(b) - this.getProsecnaOcena(a));
      default:
        return films;
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedZanr = '';
    this.sortBy = 'naslov';
    this.filteredFilms = [...this.films];
  }

  viewFilmDetails(filmId: string): void {
    this.router.navigate(['/film', filmId]);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Helper metode za ocene
  getProsecnaOcena(film: Film): number {
    if (!film.ocene || film.ocene.length === 0) {
      return 0;
    }
    const suma = film.ocene.reduce((acc: number, ocena: any) => acc + (ocena.vrednost || 0), 0);
    return suma / film.ocene.length;
  }

  getBrojOcena(film: Film): number {
    return film.ocene ? film.ocene.length : 0;
  }

  getBrojKomentara(film: Film): number {
    return film.komentari ? film.komentari.length : 0;
  }
}
