import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../models/user';
import { Iznajmljivanje } from '../models/iznajmljivanje';
import { Film } from '../models/film';
import { KorisnikDetaljnoService } from '../services/korisnik-detaljno.service';
import { GostPocetnaService } from '../services/gost-pocetna.service';
import {
  calculateRentalStatus,
  getRentalStatusString,
  isRentalActive,
  isRentalPlanned,
  isRentalReturned
} from '../utils/iznajmljivanje-helper';

@Component({
  selector: 'app-korisnik-detaljno',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './korisnik-detaljno.component.html',
  styleUrl: './korisnik-detaljno.component.css'
})
export class KorisnikDetaljnoComponent implements OnInit {
  currentUser: User | null = null;
  iznajmljivanja: Iznajmljivanje[] = [];
  favoriteFilms: Film[] = [];
  loading: boolean = true;
  favoritesLoading: boolean = true;

  // Statistika
  ukupnoIznajmljivanja: number = 0;
  aktivnaIznajmljivanja: number = 0;
  vracenaIznajmljivanja: number = 0;
  ukupnoPotroseno: number = 0;

  constructor(
    private korisnikDetaljnoService: KorisnikDetaljnoService,
    private gostPocetnaService: GostPocetnaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadIznajmljivanja();
    this.loadFavorites();
  }

  loadUserInfo(): void {
    const userToken = localStorage.getItem('loggedUser');
    if (!userToken) {
      this.router.navigate(['/']);
      return;
    }

    try {
      this.currentUser = JSON.parse(userToken);
    } catch (error) {
      console.error('Greška pri parsiranju korisničkih podataka:', error);
      this.router.navigate(['/']);
    }
  }

  loadFavorites(): void {
    if (!this.currentUser) return;

    this.favoritesLoading = true;
    this.korisnikDetaljnoService.getFavoriteFilms(this.currentUser.kor_ime).subscribe({
      next: (films: Film[]) => {
        this.favoriteFilms = films;
        this.favoritesLoading = false;
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju favorita:', err);
        this.favoritesLoading = false;
      }
    });
  }

  removeFromFavorites(filmId: string): void {
    if (!this.currentUser) return;

    this.korisnikDetaljnoService.removeFromFavorites(this.currentUser.kor_ime, filmId).subscribe({
      next: () => {
        // Ukloni iz UI
        this.favoriteFilms = this.favoriteFilms.filter(film => film._id !== filmId);
      },
      error: (err: any) => {
        console.error('Greška pri uklanjanju iz favorita:', err);
      }
    });
  }

  loadIznajmljivanja(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.korisnikDetaljnoService.getIznajmljivanjaByKorisnik(this.currentUser.kor_ime).subscribe({
      next: (data: Iznajmljivanje[]) => {
        this.iznajmljivanja = data;
        this.calculateStatistics();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju iznajmljivanja:', err);
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);

    this.ukupnoIznajmljivanja = this.iznajmljivanja.length;

    this.aktivnaIznajmljivanja = this.iznajmljivanja.filter(i => {
      const pocetak = new Date(i.datumIznajmljivanja);
      pocetak.setHours(0, 0, 0, 0);
      const kraj = new Date(i.datumVracanja);
      kraj.setHours(0, 0, 0, 0);
      return danas >= pocetak && danas < kraj;
    }).length;

    this.vracenaIznajmljivanja = this.iznajmljivanja.filter(i => {
      const kraj = new Date(i.datumVracanja);
      kraj.setHours(0, 0, 0, 0);
      return danas >= kraj;
    }).length;

    this.ukupnoPotroseno = this.iznajmljivanja.reduce((sum, i) => sum + i.ukupnaCena, 0);
  }

  getStatusClass(iznajmljivanje: Iznajmljivanje): string {
    const status = getRentalStatusString(iznajmljivanje);
    switch(status) {
      case 'aktivno': return 'status-active';
      case 'vraceno': return 'status-returned';
      case 'planirano': return 'status-planned';
      default: return '';
    }
  }

  getStatusText(iznajmljivanje: Iznajmljivanje): string {
    const status = getRentalStatusString(iznajmljivanje);
    switch(status) {
      case 'aktivno': return '🔵 Aktivno';
      case 'vraceno': return '✅ Vraćeno';
      case 'planirano': return '📅 Planirano';
      default: return status;
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Provera da li se iznajmljivanje može otkazati (više od 1 dana do početka iznajmljivanja)
  canCancelRental(iznajmljivanje: Iznajmljivanje): boolean {
    // Otkazivanje je moguće samo za planirana iznajmljivanja i ako je više od 1 dan do početka
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);
    const datumPocetka = new Date(iznajmljivanje.datumIznajmljivanja);
    datumPocetka.setHours(0, 0, 0, 0);

    // Planirano je ako danas < datumPocetka
    if (danas >= datumPocetka) return false;

    const razlikaUDanima = Math.ceil((datumPocetka.getTime() - danas.getTime()) / (1000 * 60 * 60 * 24));
    return razlikaUDanima > 1;
  }

  // Otkazivanje iznajmljivanja
  cancelRental(iznajmljivanje: Iznajmljivanje): void {
    if (!this.canCancelRental(iznajmljivanje)) {
      alert('Ne možete otkazati iznajmljivanje koje počinje za 1 dan ili manje!');
      return;
    }

    if (!iznajmljivanje._id) {
      alert('Greška: ID iznajmljivanja nije dostupan.');
      return;
    }

    const naslovFilma = iznajmljivanje.film.naslov || 'film';
    const potvrda = confirm(`Da li ste sigurni da želite da otkažete iznajmljivanje filma "${naslovFilma}"?`);

    if (potvrda) {
      this.korisnikDetaljnoService.cancelIznajmljivanje(iznajmljivanje._id).subscribe({
        next: () => {
          alert('Iznajmljivanje je uspešno otkazano!');
          this.loadIznajmljivanja(); // Osveži listu
        },
        error: (err: any) => {
          console.error('Greška pri otkazivanju iznajmljivanja:', err);
          alert('Došlo je do greške pri otkazivanju iznajmljivanja.');
        }
      });
    }
  }

  // Izračunaj preostale dane do početka iznajmljivanja
  getDaysUntilStart(iznajmljivanje: Iznajmljivanje): number {
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);

    const datumPocetka = new Date(iznajmljivanje.datumIznajmljivanja);
    datumPocetka.setHours(0, 0, 0, 0);

    return Math.ceil((datumPocetka.getTime() - danas.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Izračunaj preostale dane do kraja iznajmljivanja
  getDaysRemaining(iznajmljivanje: Iznajmljivanje): number {
    const danas = new Date();
    const datumVracanja = new Date(iznajmljivanje.datumVracanja);
    return Math.ceil((datumVracanja.getTime() - danas.getTime()) / (1000 * 60 * 60 * 24));
  }

  goBack(): void {
    this.router.navigate(['/korisnik']);
  }

  viewFilmDetails(filmId: string): void {
    this.router.navigate(['/film', filmId]);
  }

  // Helper za prosečnu ocenu
  getAverageRating(film: Film): number {
    if (!film.ocene || film.ocene.length === 0) {
      return 0;
    }
    const suma = film.ocene.reduce((acc: number, ocena: any) => acc + (ocena.vrednost || 0), 0);
    return suma / film.ocene.length;
  }

  // Expose helper functions to template
  isRentalActive(iznajmljivanje: Iznajmljivanje): boolean {
    return isRentalActive(iznajmljivanje);
  }

  isRentalPlanned(iznajmljivanje: Iznajmljivanje): boolean {
    return isRentalPlanned(iznajmljivanje);
  }

  isRentalReturned(iznajmljivanje: Iznajmljivanje): boolean {
    return isRentalReturned(iznajmljivanje);
  }
}
