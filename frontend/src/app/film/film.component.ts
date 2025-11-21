import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Film } from '../models/film';
import { GostPocetnaService } from '../services/gost-pocetna.service';
import { KorisnikDetaljnoService } from '../services/korisnik-detaljno.service';
import { ToastService } from '../services/toast.service';
import { RecommendationService } from '../services/recommendation.service';
import { VideoPlayerComponent } from '../components/video-player/video-player.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-film',
  standalone: true,
  imports: [CommonModule, FormsModule, VideoPlayerComponent, RouterModule, BaseChartDirective],
  templateUrl: './film.component.html',
  styleUrl: './film.component.css'
})
export class FilmComponent implements OnInit {
  availableCount: number = 0;
  film: Film | null = null;
  loading: boolean = true;
  error: string = '';
  isFavorite: boolean = false;
  userRating: number = 0;
  hasUserRated: boolean = false; // Da li je korisnik već ocenio film
  isLoggedIn: boolean = false;
  rentingInProgress: boolean = false; // Za loading state dugmeta

  // Komentari
  newComment: string = '';
  submittingComment: boolean = false;

  // KNN Recommendations
  similarFilms: Film[] = [];
  recommendationsLoading: boolean = false;

  // Modal za iznajmljivanje
  showRentalModal: boolean = false;
  rentalStartDate: string = '';
  rentalEndDate: string = '';
  minStartDate: string = '';
  minEndDate: string = '';
  totalDays: number = 0;
  totalPrice: number = 0;

  // Kreditna kartica
  cardNumber: string = '';
  cardType: string = '';
  isCardValid: boolean = false;

  // Poruka o rezultatu iznajmljivanja
  rentalResultMessage: string = '';
  rentalResultError: boolean = false;

  // Chart.js properties
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Broj ocena: ${context.parsed.y}`;
          }
        }
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gostPocetnaService: GostPocetnaService,
    private korisnikDetaljnoService: KorisnikDetaljnoService,
    private toastService: ToastService,
    private recommendationService: RecommendationService
  ) {}

  ngOnInit(): void {
    // Proveri da li je korisnik ulogovan
    this.checkIfLoggedIn();

    // Postavi minimalni datum za početak (sutra)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minStartDate = this.formatDateForInput(tomorrow);

    const filmId = this.route.snapshot.paramMap.get('id');
    if (filmId) {
      this.loadFilm(filmId);
    } else {
      this.error = 'ID filma nije pronađen';
      this.loading = false;
    }
  }

  checkIfLoggedIn(): void {
    // Proveri da li postoji loggedUser u localStorage
    const token = localStorage.getItem('loggedUser');
    this.isLoggedIn = !!token;
  }

  loadFilm(id: string): void {
    this.gostPocetnaService.getFilmById(id).subscribe({
      next: (data: Film | null) => {
        if (data) {
          this.film = data;
          console.log('📽️ Film učitan:', this.film);
          console.log('⭐ Ocene:', this.film.ocene);
          console.log('📊 Broj ocena:', this.getBrojOcena());
          console.log('📈 Prosečna ocena:', this.getProsecnaOcena());
        this.loading = false;
          this.checkIfFavorite();
          this.checkIfUserRated(); // Proveri da li je korisnik ocenio film
          this.loadSimilarFilms(); // Učitaj slične filmove

          // Izračunaj dostupnost na osnovu aktivnih iznajmljivanja
          this.korisnikDetaljnoService.getAllIznajmljivanja().subscribe({
            next: (rentals) => {
              if (!this.film) return;
              const now = new Date();
              const activeRentals = rentals.filter(r => r.film._id === this.film!._id && new Date(r.datumVracanja) > now);
              this.availableCount = Math.max(0, this.film.ukupnoKomada - activeRentals.length);
            },
            error: (err) => {
              console.error('Greška pri učitavanju iznajmljivanja:', err);
              this.availableCount = this.film ? this.film.ukupnoKomada : 0;
            }
          });
        } else {
          this.error = 'Film nije pronađen';
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju filma:', err);
        this.error = 'Film nije pronađen';
    this.loading = false;
  }
    });
  }

  checkIfFavorite(): void {
    if (!this.isLoggedIn || !this.film) return;

    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    const username = currentUser.kor_ime;

    if (!username) return;

    // Proveri iz backend-a
    this.korisnikDetaljnoService.getFavoriteFilms(username).subscribe({
      next: (favorites) => {
        this.isFavorite = favorites.some(f => f._id === this.film?._id);
      },
      error: (err) => {
        console.error('Greška pri proveri favorita:', err);
      }
    });
  }


  toggleFavorite(): void {
    if (!this.film) return;

    // Proveri da li je korisnik ulogovan
    if (!this.isLoggedIn) {
      this.toastService.warning('Morate biti ulogovani da biste dodali film u favorite!');
      this.router.navigate(['/']);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    const username = currentUser.kor_ime;

    if (!username) {
      this.toastService.error('Greška: Korisničko ime nije pronađeno');
      return;
    }

    if (this.isFavorite) {
      // Ukloni iz favorites
      this.korisnikDetaljnoService.removeFromFavorites(username, this.film._id!).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Greška pri uklanjanju iz favorita:', err);
        }
      });
    } else {
      // Dodaj u favorites
      this.korisnikDetaljnoService.addToFavorites(username, this.film._id!).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => {
          console.error('Greška pri dodavanju u favorite:', err);
        }
      });
    }
  }

  checkIfUserRated(): void {
    if (!this.isLoggedIn || !this.film) return;

    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    const username = currentUser.kor_ime;

    if (!username) return;

    // Proveri da li korisnik već ima ocenu za ovaj film
    const userOcena = this.film.ocene?.find((o: any) => o.korisnik === username);
    if (userOcena) {
      this.hasUserRated = true;
      this.userRating = userOcena.ocena || userOcena.vrednost;
    } else {
      this.hasUserRated = false;
      this.userRating = 0;
    }
  }

  rateFilm(rating: number): void {
    if (!this.film) return;

    // Proveri da li je korisnik ulogovan
    if (!this.isLoggedIn) {
      this.toastService.warning('Morate biti ulogovani da biste ocenili film!');
      this.router.navigate(['/']);
      return;
    }

    // Proveri da li je korisnik već ocenio film
    if (this.hasUserRated) {
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    const username = currentUser.kor_ime;

    if (!username) {
      return;
    }

    // Pošalji ocenu na backend
    this.gostPocetnaService.addRating(this.film._id!, username, rating).subscribe({
      next: (response) => {
        this.userRating = rating;
        this.hasUserRated = true;

        // Osveži film podatke
        this.loadFilm(this.film!._id!);
      },
      error: (err) => {
        console.error('Greška pri ocenjivanju filma:', err);
      }
    });
  }

  submitComment(): void {
    if (!this.film) return;

    // Proveri da li je korisnik ulogovan
    if (!this.isLoggedIn) {
      this.toastService.warning('Morate biti ulogovani da biste komentarisali!');
      this.router.navigate(['/']);
      return;
    }

    // Proveri da li je komentar prazan
    if (!this.newComment.trim()) {
      this.toastService.warning('Komentar ne može biti prazan!');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    const username = currentUser.kor_ime;

    if (!username) {
      this.toastService.error('Greška: Korisničko ime nije pronađeno');
      return;
    }

    this.submittingComment = true;

    // Pošalji komentar na backend
    this.gostPocetnaService.addComment(this.film._id!, username, this.newComment).subscribe({
      next: (response) => {
        this.toastService.success('Komentar uspešno dodat!');
        this.newComment = ''; // Očisti polje
        this.submittingComment = false;

        // Osveži film podatke
        this.loadFilm(this.film!._id!);
      },
      error: (err) => {
        console.error('Greška pri dodavanju komentara:', err);
        this.toastService.error('Greška pri dodavanju komentara');
        this.submittingComment = false;
      }
    });
  }

  goBack(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/korisnik']);
    } else {
      this.router.navigate(['/gost']);
    }
  }

  getProsecnaOcena(): number {
    if (!this.film || !this.film.ocene || this.film.ocene.length === 0) {
      return 0;
    }
    const suma = this.film.ocene.reduce((acc: number, ocena: any) => acc + (ocena.ocena || ocena.vrednost || 0), 0);
    return suma / this.film.ocene.length;
  }

  getBrojOcena(): number {
    return this.film?.ocene ? this.film.ocene.length : 0;
  }

  getBrojKomentara(): number {
    return this.film?.komentari ? this.film.komentari.length : 0;
    }

  // Kreiranje grafikona distribucije ocena
  createRatingDistributionChart(): void {
    if (!this.film || !this.film.ocene || this.film.ocene.length === 0) {
      return;
    }

    // Brojanje ocena od 1 do 5
    const distribution = [0, 0, 0, 0, 0]; // [1-star, 2-star, 3-star, 4-star, 5-star]

    this.film.ocene.forEach((ocena: any) => {
      if (ocena.vrednost >= 1 && ocena.vrednost <= 5) {
        distribution[ocena.vrednost - 1]++;
      }
    });

    // Postavljanje podataka za Chart.js
    this.barChartData = {
      labels: ['⭐ 1', '⭐⭐ 2', '⭐⭐⭐ 3', '⭐⭐⭐⭐ 4', '⭐⭐⭐⭐⭐ 5'],
      datasets: [
        {
          data: distribution,
          backgroundColor: [
            'rgba(220, 38, 38, 0.7)',   // 1 star - red
            'rgba(251, 146, 60, 0.7)',  // 2 stars - orange
            'rgba(251, 191, 36, 0.7)',  // 3 stars - yellow
            'rgba(132, 204, 22, 0.7)',  // 4 stars - lime
            'rgba(34, 197, 94, 0.7)'    // 5 stars - green
          ],
          borderColor: [
            'rgba(220, 38, 38, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(132, 204, 22, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    };
  }

  // Provera da li je film dostupan za iznajmljivanje
  isFilmAvailable(): boolean {
    return this.availableCount > 0;
  }

  // Iznajmi film - otvori modal
  rentFilm(): void {
    if (!this.film) return;

    // Proveri da li je korisnik ulogovan
    if (!this.isLoggedIn) {
      this.toastService.warning('Morate biti ulogovani da biste iznajmili film!');
      this.router.navigate(['/']);
      return;
    }

    // Proveri dostupnost
    if (!this.isFilmAvailable()) {
      this.toastService.error('Trenutno nema dostupnih primeraka ovog filma.');
      return;
    }

    // Otvori modal
    this.showRentalModal = true;
  }

  // Zatvori modal
  closeRentalModal(): void {
    this.showRentalModal = false;
    this.rentalStartDate = '';
    this.rentalEndDate = '';
    this.totalDays = 0;
    this.totalPrice = 0;
    this.cardNumber = '';
    this.cardType = '';
    this.isCardValid = false;
  }

  // Format datuma za input type="date"
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Kada se promeni datum početka
  onStartDateChange(): void {
    if (this.rentalStartDate) {
      // Postavi minimalni datum za kraj (minimum 1 dan posle početka)
      const startDate = new Date(this.rentalStartDate);
      startDate.setDate(startDate.getDate() + 1);
      this.minEndDate = this.formatDateForInput(startDate);

      // Ako je kraj već izabran ali je pre novog minimuma, resetuj ga
      if (this.rentalEndDate && this.rentalEndDate <= this.rentalStartDate) {
        this.rentalEndDate = '';
        this.calculateTotalPrice();
      } else if (this.rentalEndDate) {
        this.calculateTotalPrice();
      }
    }
  }

  // Kada se promeni datum kraja
  onEndDateChange(): void {
    this.calculateTotalPrice();
  }

  // Izračunaj ukupnu cenu
  calculateTotalPrice(): void {
    if (!this.film || !this.rentalStartDate || !this.rentalEndDate) {
      this.totalDays = 0;
      this.totalPrice = 0;
      return;
    }

    const start = new Date(this.rentalStartDate);
    const end = new Date(this.rentalEndDate);

    // Izračunaj broj dana
    const diffTime = end.getTime() - start.getTime();
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Izračunaj ukupnu cenu
    this.totalPrice = this.totalDays * this.film.cenaDnevno;
  }

  // Potvrdi iznajmljivanje
  confirmRental(): void {
    this.rentalResultMessage = '';
    if (!this.film || !this.rentalStartDate || !this.rentalEndDate) {
      this.rentalResultMessage = 'Molimo izaberite datum početka i kraja iznajmljivanja!';
      this.rentalResultError = true;
      return;
    }

    if (this.totalDays < 1) {
      this.rentalResultMessage = 'Iznajmljivanje mora trajati najmanje 1 dan!';
      this.rentalResultError = true;
      return;
    }

    // Validacija kreditne kartice
    if (!this.isCardValid) {
      this.rentalResultMessage = 'Molimo unesite validan broj kreditne kartice!';
      this.rentalResultError = true;
      return;
    }

    this.rentalResultError = false;
    this.rentingInProgress = true;
    // Proveri konflikt sa postojećim iznajmljivanjima
    this.checkConflictAndProceed();
  }

  // Format datuma za prikaz (dd.mm.yyyy)
  formatDateDisplay(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Proveri konflikt i nastavi sa iznajmljivanjem
  private checkConflictAndProceed(): void {
    if (!this.film || !this.film._id) return;

    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}').kor_ime || '';
    const startDate = new Date(this.rentalStartDate);
    const endDate = new Date(this.rentalEndDate);

    this.korisnikDetaljnoService.checkRentalConflict(currentUser, this.film._id, startDate, endDate)
      .subscribe(hasConflict => {
        if (hasConflict) {
          this.rentingInProgress = false;
          this.rentalResultMessage = 'Ne možete iznajmiti ovaj film! Već imate aktivno iznajmljivanje koje se preklapa sa izabranim terminima.';
          this.rentalResultError = true;
          return;
        }
        // Ako nema konflikta, nastavi sa potvrdom
        this.proceedWithRental();
      });
  }

  // Nastavi sa iznajmljivanjem (nakon provere konflikta)
  private proceedWithRental(): void {
    if (!this.film) return;

    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    const username = currentUser.kor_ime;

    if (!username) {
      this.rentingInProgress = false;
      this.rentalResultMessage = 'Greška: Korisničko ime nije pronađeno';
      this.rentalResultError = true;
      return;
    }

    const datumPocetka = new Date(this.rentalStartDate);
    const datumZavrsetka = new Date(this.rentalEndDate);

    // Poziv backend servisa za iznajmljivanje
    this.gostPocetnaService.rentFilm(
      this.film._id!,
      username,
      datumPocetka,
      datumZavrsetka,
      this.totalDays,
      this.totalPrice,
      this.cardNumber
    ).subscribe({
      next: (response) => {
        if (this.film) {
          this.availableCount = Math.max(0, this.availableCount - 1);
          this.rentingInProgress = false;
          this.rentalResultMessage = `✅ Uspešno ste iznajmili film "${this.film.naslov}"! Period: ${this.formatDateDisplay(this.rentalStartDate)} - ${this.formatDateDisplay(this.rentalEndDate)}.`;
          this.rentalResultError = false;
        }
      },
      error: (err) => {
        console.error('Greška pri iznajmljivanju filma:', err);
        this.rentingInProgress = false;
        this.rentalResultMessage = 'Greška pri iznajmljivanju filma. Pokušajte ponovo.\n' + (err?.error?.message || err?.message || err);
        this.rentalResultError = true;
      }
    });
  }

  // KNN - Učitaj slične filmove
  loadSimilarFilms(): void {
    if (!this.film) return;

    this.recommendationsLoading = true;

    // Učitaj sve filmove
    this.gostPocetnaService.getAllFilms().subscribe({
      next: (allFilms: Film[]) => {
        // Pronađi 3 najsličnija filma koristeći KNN algoritam
        this.similarFilms = this.recommendationService.getSimilarFilms(
          this.film!,
          allFilms,
          3 // K = 3 najbliža filma
        );
        this.recommendationsLoading = false;

        console.log('🤖 KNN Preporuke za film:', this.film?.naslov);
        console.log('📊 Pronađeno sličnih filmova:', this.similarFilms.length);
        this.similarFilms.forEach((film, index) => {
          const similarity = this.recommendationService.getSimilarityPercentage(this.film!, film);
          console.log(`${index + 1}. ${film.naslov} - Sličnost: ${similarity}%`);
        });
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju preporuka:', err);
        this.recommendationsLoading = false;
      }
    });
  }

  // Helper metoda za procenat sličnosti (za prikaz u UI)
  getSimilarityPercentage(film: Film): number {
    if (!this.film) return 0;
    return this.recommendationService.getSimilarityPercentage(this.film, film);
  }

  // Helper metoda za prosečnu ocenu bilo kog filma
  getAverageRating(film: Film): number {
    if (!film.ocene || film.ocene.length === 0) {
      return 0;
    }
    const suma = film.ocene.reduce((acc: number, ocena: any) => acc + (ocena.vrednost || 0), 0);
    return suma / film.ocene.length;
  }

  // Navigacija na drugi film
  navigateToFilm(filmId: string): void {
    // Scroll na vrh stranice
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Navigate i reload podataka
    this.router.navigate(['/film', filmId]).then(() => {
      // Reset state
      this.loading = true;
      this.film = null;
      this.similarFilms = [];

      // Učitaj novi film
      this.loadFilm(filmId);
    });
  }

  // ==================== VALIDACIJA KREDITNE KARTICE ====================

  // Validacija kreditne kartice prilikom unosa
  onCardNumberInput(): void {
    // Ukloni sve osim cifara
    this.cardNumber = this.cardNumber.replace(/\D/g, '');

    // Ograniči na 16 cifara
    if (this.cardNumber.length > 16) {
      this.cardNumber = this.cardNumber.substring(0, 16);
    }

    // Validacija
    this.validateCardNumber();
  }

  // Validacija broja kartice
  validateCardNumber(): void {
    const cardNum = this.cardNumber;

    // Reset
    this.cardType = '';
    this.isCardValid = false;

    // Provera dužine
    if (cardNum.length < 15) {
      return;
  }

    // Diners - počinje sa 300, 301, 302, 303, 36, 38 i ima tačno 15 cifara
    if (cardNum.length === 15) {
      if (
        cardNum.startsWith('300') ||
        cardNum.startsWith('301') ||
        cardNum.startsWith('302') ||
        cardNum.startsWith('303') ||
        cardNum.startsWith('36') ||
        cardNum.startsWith('38')
      ) {
        this.cardType = 'diners';
        this.isCardValid = true;
        return;
      }
    }

    // MasterCard i Visa - tačno 16 cifara
    if (cardNum.length === 16) {
      // MasterCard - počinje sa 51, 52, 53, 54, 55
      if (
        cardNum.startsWith('51') ||
        cardNum.startsWith('52') ||
        cardNum.startsWith('53') ||
        cardNum.startsWith('54') ||
        cardNum.startsWith('55')
      ) {
        this.cardType = 'mastercard';
        this.isCardValid = true;
        return;
      }

      // Visa - počinje sa 4539, 4556, 4916, 4532, 4929, 4485, 4716
      if (
        cardNum.startsWith('4539') ||
        cardNum.startsWith('4556') ||
        cardNum.startsWith('4916') ||
        cardNum.startsWith('4532') ||
        cardNum.startsWith('4929') ||
        cardNum.startsWith('4485') ||
        cardNum.startsWith('4716')
      ) {
        this.cardType = 'visa';
        this.isCardValid = true;
        return;
      }
    }
  }

  // Format broj kartice za prikaz (sa razmacima)
  getFormattedCardNumber(): string {
    if (!this.cardNumber) return '';

    // Diners: XXXX XXXXXX XXXXX (4-6-5)
    if (this.cardType === 'diners') {
      return this.cardNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }

    // Visa i MasterCard: XXXX XXXX XXXX XXXX (4-4-4-4)
    if (this.cardType === 'visa' || this.cardType === 'mastercard') {
      return this.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // Default - svake 4 cifre
    return this.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
}

