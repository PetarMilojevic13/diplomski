import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Film, Zanr, getAllZanrovi } from '../models/film';
import { GostPocetnaService } from '../services/gost-pocetna.service';
import { User } from '../models/user';
import { KorisnikPocetnaService } from '../services/korisnik-pocetna.service';
import { Iznajmljivanje } from '../models/iznajmljivanje';
import { RecommendationService } from '../services/recommendation.service';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-korisnik-pocetna',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent],
  templateUrl: './korisnik-pocetna.component.html',
  styleUrl: './korisnik-pocetna.component.css'
})
export class KorisnikPocetnaComponent implements OnInit {
  films: Film[] = [];
  filteredFilms: Film[] = [];
  loading: boolean = true;

  searchQuery: string = '';
  selectedZanr: string = '';
  sortBy: string = 'naslov';

  allZanrovi: string[] = [];

  // User info
  currentUser: User | null = null;
  userName: string = '';
  userInitials: string = '';
  profileImage: string = ''; // Base64 slika

  // Aktivne rezervacije
  aktivneRezervacije: Iznajmljivanje[] = [];
  // Planirane rezervacije koje tek treba da počnu
  planiraneRezervacije: Iznajmljivanje[] = [];

  // KNN Personalizovane preporuke
  recommendedFilms: Film[] = [];
  recommendationsLoading: boolean = false;
  allUserRentals: Iznajmljivanje[] = []; // SVE rezervacije korisnika

  constructor(
    private gostPocetnaService: GostPocetnaService,
    private korisnikPocetnaService: KorisnikPocetnaService,
    private recommendationService: RecommendationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.loadFilms();
    this.loadAktivneRezervacije();
    this.loadAllUserRentals(); // Učitaj SVE rezervacije za preporuke
  }

  getUserInfo(): void {
    const userToken = localStorage.getItem('loggedUser');
    if (!userToken) {
      this.router.navigate(['/']);
      return;
    }

    try {
      const user: User = JSON.parse(userToken);
      this.currentUser = user;
      this.userName = user.ime;
      this.profileImage = user.profileImage; // Učitaj profilnu sliku
      // Kreiraj inicijale za fallback ako nema slike
      this.userInitials = user.ime.charAt(0) + user.prezime.charAt(0);
    } catch (error) {
      console.error('Greška pri parsiranju korisničkih podataka:', error);
      this.userName = 'Korisnik';
      this.userInitials = 'K';
      this.profileImage = '';
    }
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

  applyFilters(): void {
    let result = [...this.films];

    // Pretraga samo po naslovu filma
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(film =>
        film.naslov.toLowerCase().includes(query)
      );
    }

    // Filter po žanru
    if (this.selectedZanr) {
      result = result.filter(film => film.zanr.map(z => z.toString()).includes(this.selectedZanr));
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

  loadAllZanrovi(): void {
    // Koristi sve žanrove iz Zanr enum-a
    this.allZanrovi = getAllZanrovi().sort();
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

  loadAktivneRezervacije(): void {
    if (!this.currentUser) return;

    this.korisnikPocetnaService.getIznajmljivanjaByKorisnik(this.currentUser.kor_ime).subscribe({
      next: (data: Iznajmljivanje[]) => {
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);

        const active: Iznajmljivanje[] = [];
        const upcoming: Iznajmljivanje[] = [];

        for (const iz of data) {
          const datumIznajmljivanja = new Date(iz.datumIznajmljivanja);
          datumIznajmljivanja.setHours(0, 0, 0, 0);
          const datumVracanja = iz.datumVracanja ? new Date(iz.datumVracanja) : null;
          if (datumVracanja) datumVracanja.setHours(0, 0, 0, 0);

          if (isNaN(datumIznajmljivanja.getTime())) continue;

          const isActive = datumVracanja ? (datumIznajmljivanja <= danas && danas < datumVracanja) : (datumIznajmljivanja <= danas);
          const isUpcoming = datumIznajmljivanja > danas;

          if (isActive) active.push(iz);
          else if (isUpcoming) upcoming.push(iz);
        }

        // Sort active by nearest return date, upcoming by start date
        active.sort((a, b) => {
          const aEnd = a.datumVracanja ? new Date(a.datumVracanja).getTime() : Infinity;
          const bEnd = b.datumVracanja ? new Date(b.datumVracanja).getTime() : Infinity;
          return aEnd - bEnd;
        });

        upcoming.sort((a, b) => new Date(a.datumIznajmljivanja).getTime() - new Date(b.datumIznajmljivanja).getTime());

        this.aktivneRezervacije = active;
        this.planiraneRezervacije = upcoming;
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju aktivnih rezervacija:', err);
      }
    });
  }

  // Broj dana do početka iznajmljivanja
  getDaniDoPocetka(iznajmljivanje: Iznajmljivanje): number {
    const danas = new Date();
    danas.setHours(0,0,0,0);
    const start = new Date(iznajmljivanje.datumIznajmljivanja);
    start.setHours(0,0,0,0);
    const razlika = start.getTime() - danas.getTime();
    const dani = Math.ceil(razlika / (1000 * 60 * 60 * 24));
    return dani > 0 ? dani : 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedZanr = '';
    this.sortBy = 'naslov';
    this.filteredFilms = [...this.films];
  }

  viewFilmDetails(filmId: string | undefined): void {
    if (filmId) {
      this.router.navigate(['/film', filmId]);
    }
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    this.router.navigate(['/korisnik-detaljno']);
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

  // Učitaj SVE rezervacije korisnika (za personalizovane preporuke)
  loadAllUserRentals(): void {
    if (!this.currentUser) return;

    this.korisnikPocetnaService.getIznajmljivanjaByKorisnik(this.currentUser.kor_ime).subscribe({
      next: (data: Iznajmljivanje[]) => {
        this.allUserRentals = data; // SVE rezervacije (aktivno, vraceno, planirano)
        this.loadPersonalizedRecommendations(); // Nakon što učitamo rezervacije, kreiraj preporuke
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju rezervacija:', err);
      }
    });
  }

  // KNN Personalizovane preporuke
  loadPersonalizedRecommendations(): void {
    this.recommendationsLoading = true;

    // Učitaj sve filmove
    this.gostPocetnaService.getAllFilms().subscribe({
      next: (allFilms: Film[]) => {
        // Pozovi KNN algoritam sa korisnikovom istorijom
        this.recommendedFilms = this.recommendationService.getPersonalizedRecommendations(
          this.allUserRentals,
          allFilms,
          3 // Top 3 preporuke
        );

        this.recommendationsLoading = false;

        console.log('🤖 Personalizovane KNN preporuke za:', this.currentUser?.kor_ime);
        console.log('📊 Ukupno rezervacija korisnika:', this.allUserRentals.length);
        console.log('📊 Završenih rezervacija:', this.allUserRentals.filter(r => {
          const danas = new Date();
          danas.setHours(0, 0, 0, 0);
          const kraj = new Date(r.datumVracanja);
          kraj.setHours(0, 0, 0, 0);
          return danas >= kraj;
        }).length);
        console.log('🎬 Preporučeni filmovi:', this.recommendedFilms.map(f => f.naslov));

        // Prikaz najčešćih žanrova korisnika
        const topGenres = this.recommendationService.getMostFrequentGenres(this.allUserRentals);
        console.log('🎭 Omiljeni žanrovi korisnika:', topGenres.slice(0, 3));
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju preporuka:', err);
        this.recommendationsLoading = false;
      }
    });
  }

  getPreostaloDana(iznajmljivanje: Iznajmljivanje): number {
    const danas = new Date();
    const datumVracanja = new Date(iznajmljivanje.datumVracanja);
    const razlika = datumVracanja.getTime() - danas.getTime();
    const dani = Math.ceil(razlika / (1000 * 60 * 60 * 24));
    return dani > 0 ? dani : 0;
  }

  isLastDay(iznajmljivanje: Iznajmljivanje): boolean {
    return this.getPreostaloDana(iznajmljivanje) === 1;
  }
}
