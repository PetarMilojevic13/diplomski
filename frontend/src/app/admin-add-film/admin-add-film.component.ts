import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Film, Zanr, getAllZanrovi } from '../models/film';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-admin-add-film',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-add-film.component.html',
  styleUrl: './admin-add-film.component.css'
})
export class AdminAddFilmComponent {
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
  private router = inject(Router);
  private filmService = inject(FilmService);

  film: Film = new Film();
  errorMessage: string = '';
  successMessage: string = '';

  // Za multi-select žanrova
  availableZanrovi: string[] = getAllZanrovi();
  selectedZanrovi: { [key: string]: boolean } = {};

  // Za dinamičke nizove
  glumacInput: string = '';
  titloviInput: string = '';

  constructor() {
    // Postavi default vrednosti
    this.film.godina = new Date().getFullYear();
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
    // Resetuj poruke
    this.errorMessage = '';
    this.successMessage = '';

    // Lista grešaka
    const errors: string[] = [];

    // Validacija obaveznih polja
    if (!this.film.naslov || this.film.naslov.trim() === '') {
      errors.push('Naziv filma je obavezan');
    }
    if (!this.film.opis || this.film.opis.trim() === '') {
      errors.push('Opis filma je obavezan');
    }
    if (!this.film.poster || this.film.poster.trim() === '') {
      errors.push('Poster filma je obavezan');
    }
    if (!this.film.zanr || this.film.zanr.length === 0) {
      errors.push('Morate izabrati bar jedan žanr');
    }
    if (!this.film.reziser || this.film.reziser.length === 0) {
      errors.push('Morate uneti bar jednog reditelja');
    }
    if (!this.film.glumci || this.film.glumci.length === 0) {
      errors.push('Morate uneti bar jednog glumca');
    }
    if (!this.film.godina || this.film.godina < 1800 || this.film.godina > new Date().getFullYear() + 5) {
      errors.push('Godina mora biti između 1800 i ' + (new Date().getFullYear() + 5));
    }
    if (!this.film.trajanjeMin || this.film.trajanjeMin <= 0) {
      errors.push('Trajanje filma mora biti veće od 0 minuta');
    }
    if (!this.film.trailerUrl || this.film.trailerUrl.trim() === '') {
      errors.push('Trailer URL je obavezan');
    }
    if (this.film.ukupnoKomada === undefined || this.film.ukupnoKomada < 0) {
      errors.push('Ukupan broj komada mora biti 0 ili veći');
    }
    if (this.film.cenaDnevno === undefined || this.film.cenaDnevno <= 0) {
      errors.push('Cena po danu mora biti veća od 0');
    }

    // Ako ima grešaka, prikaži ih
    if (errors.length > 0) {
      this.errorMessage = '❌ Greške u formi:\n' + errors.map((err, i) => `${i + 1}. ${err}`).join('\n');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Ako nema grešaka, pošalji create na backend
    this.filmService.createFilm(this.film).subscribe({
      next: (createdFilm) => {
        console.log('✅ Film uspešno kreiran:', createdFilm);
        this.successMessage = `✅ Film "${this.film.naslov}" je uspešno dodat u bazu podataka!`;
        this.errorMessage = '';

        // Skroluj do vrha da korisnik vidi success poruku
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Nakon 2 sekunde vrati se na admin panel
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Greška pri kreiranju filma:', err);
        this.errorMessage = '❌ ' + (err.message || 'Došlo je do greške pri kreiranju filma na serveru.');
        this.successMessage = '';

        // Skroluj do vrha da korisnik vidi greške
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

}
