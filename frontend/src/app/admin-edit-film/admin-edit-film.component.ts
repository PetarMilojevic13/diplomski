import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Film, Zanr, getAllZanrovi } from '../models/film';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-admin-edit-film',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-edit-film.component.html',
  styleUrl: './admin-edit-film.component.css'
})
export class AdminEditFilmComponent implements OnInit {
    onCancel(): void {
      this.router.navigate(['/admin']);
    }

    onPosterChange(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.film.poster = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private filmService = inject(FilmService);

  film: Film = new Film();
  filmId: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  // Za multi-select žanrova
  availableZanrovi: string[] = getAllZanrovi();
  selectedZanrovi: { [key: string]: boolean } = {};

  // Za dinamičke nizove
  glumacInput: string = '';
  titloviInput: string = '';

  constructor() {}

  ngOnInit(): void {
    // Uzmi ID filma iz rute
    this.filmId = this.route.snapshot.paramMap.get('id') || '';

    if (this.filmId) {
      this.loadFilm();
    } else {
      this.errorMessage = 'ID filma nije pronađen!';
      this.loading = false;
    }
  }

  loadFilm(): void {
    this.loading = true;
    this.filmService.getFilmById(this.filmId).subscribe({
      next: (film) => {
        this.film = { ...film };

        // Inicijalizuj selected žanrove
        this.availableZanrovi.forEach(zanr => {
          this.selectedZanrovi[zanr] = this.film.zanr.includes(zanr as Zanr);
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju filma:', err);
        this.errorMessage = 'Greška pri učitavanju podataka filma.';
        this.loading = false;
      }
    });
  }

  onZanrChange(zanr: string, event: any): void {
    this.selectedZanrovi[zanr] = event.target.checked;

    // Ažuriraj film.zanr niz
    this.film.zanr = this.availableZanrovi
      .filter(z => this.selectedZanrovi[z])
      .map(z => z as Zanr);
  }

  addGlumac(): void {
    if (this.glumacInput.trim()) {
      if (!this.film.glumci) {
        this.film.glumci = [];
      }
      this.film.glumci.push(this.glumacInput.trim());
      this.glumacInput = '';
    }
  }

  removeGlumac(index: number): void {
    this.film.glumci.splice(index, 1);
  }

  addTitl(): void {
    if (this.titloviInput.trim()) {
      if (!this.film.titlovi) {
        this.film.titlovi = [];
      }
      this.film.titlovi.push(this.titloviInput.trim());
      this.titloviInput = '';
    }
  }

  removeTitl(index: number): void {
    this.film.titlovi!.splice(index, 1);
  }

  onSubmit(): void {
    // Validacija
    if (!this.film.naslov || this.film.reziser.length === 0 || this.film.zanr.length === 0) {
      this.errorMessage = 'Molimo popunite sva obavezna polja (Naziv, Režiser, žanr)!';
      return;
    }

    // Pošalji update na backend
    this.filmService.updateFilm(this.filmId, this.film).subscribe({
      next: (updatedFilm) => {
        console.log('✅ Film uspešno ažuriran:', updatedFilm);
        this.successMessage = `Film "${this.film.naslov}" je uspešno ažuriran!`;
        this.errorMessage = '';

        // Nakon 2 sekunde vrati se na admin panel
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Greška pri ažuriranju filma:', err);
        this.errorMessage = err.message || 'Došlo je do greške pri ažuriranju filma.';
        this.successMessage = '';
      }
    });
  }

}
