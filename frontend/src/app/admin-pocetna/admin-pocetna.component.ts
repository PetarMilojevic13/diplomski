import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { GostPocetnaService } from '../services/gost-pocetna.service';
import { AdminPocetnaService } from '../services/admin-pocetna.service';
import { Film } from '../models/film';
import { Iznajmljivanje } from '../models/iznajmljivanje';
import { RegistrationService } from '../servisi/registration.service';
import { Chart, registerables } from 'chart.js';

// Register Chart.js komponente
Chart.register(...registerables);

interface MonthlyStats {
  month: string;
  count: number;
}

@Component({
  selector: 'app-admin-pocetna',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pocetna.component.html',
  styleUrl: './admin-pocetna.component.css'
})
export class AdminPocetnaComponent implements OnInit, AfterViewInit, OnDestroy {
  // Admin info
  currentAdmin: User | null = null;
  adminName: string = '';
  adminInitials: string = '';
  profileImage: string = '';

  // Statistike
  totalFilms: number = 0;
  totalUsers: number = 0;
  activeRentals: number = 0;
  pendingRequests: number = 0;
  // Rentals
  allRentals: Iznajmljivanje[] = [];
  activeRentalsList: Iznajmljivanje[] = [];

  // Loading states
  statsLoading: boolean = true;
  chartLoading: boolean = true;

  // Chart
  rentalTrendChart: Chart | null = null;
  monthlyData: MonthlyStats[] = [];

  // Films management
  allFilms: Film[] = [];
  filteredFilms: Film[] = [];
  searchQuery: string = '';
  filmsLoading: boolean = true;

  constructor(
    private router: Router,
    private gostPocetnaService: GostPocetnaService,
    private adminPocetnaService: AdminPocetnaService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.getAdminInfo();
    this.loadStatistics();
    this.loadFilms();
    this.loadPendingRequests();
    this.loadAllRentals();
  }

  ngAfterViewInit(): void {
    // Chart se kreira nakon što se view inicijalizuje i podaci učitaju
    // Ne kreiramo chart ovde, već ćemo ga kreirati nakon što se učitaju podaci
  }

  getAdminInfo(): void {
    const adminToken = localStorage.getItem('loggedUser');
    if (!adminToken) {
      this.router.navigate(['/login-admin']);
      return;
    }

    try {
      const admin: User = JSON.parse(adminToken);

      // Proveri da li je zaista admin
      if (admin.type !== 'admin') {
        console.error('Korisnik nije administrator!');
        this.router.navigate(['/']);
        return;
      }

      this.currentAdmin = admin;
      this.adminName = admin.ime + ' ' + admin.prezime;
      this.profileImage = admin.profileImage;
      this.adminInitials = admin.ime.charAt(0) + admin.prezime.charAt(0);

      console.log('✅ Admin prijavljen:', this.adminName);
    } catch (error) {
      console.error('Greška pri parsiranju admin podataka:', error);
      this.router.navigate(['/login-admin']);
    }
  }

  loadStatistics(): void {
    this.statsLoading = true;

    // 1. Učitaj ukupan broj filmova
    this.gostPocetnaService.getAllFilms().subscribe({
      next: (films: Film[]) => {
        this.totalFilms = films.length;
        console.log('📊 Ukupno filmova:', this.totalFilms);
      },
      error: (err) => {
        console.error('Greška pri učitavanju filmova:', err);
      }
    });

    // 2. Učitaj broj aktivnih korisnika (status=1 i type='korisnik')
    this.adminPocetnaService.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.filter(u => u.status === 1 && u.type === 'korisnik').length;
        console.log('👥 Broj aktivnih korisnika (status=1):', this.totalUsers);
      },
      error: (err) => {
        console.error('Greška pri učitavanju korisnika:', err);
        this.totalUsers = 0;
      }
    });

    // 3. Učitaj statistiku iznajmljivanja i mesečne trendove
    this.loadRentalStatistics();
  }

  loadRentalStatistics(): void {
    // Učitaj statistiku iznajmljivanja
    this.adminPocetnaService.getRentalStatistics().subscribe({
      next: (stats) => {
        this.activeRentals = stats.activeRentals;
        console.log('🎬 Aktivna iznajmljivanja:', this.activeRentals);
      },
      error: (err) => {
        console.error('Greška pri učitavanju statistike iznajmljivanja:', err);
        this.activeRentals = 0;
      }
    });

    // Učitaj mesečne trendove
    this.adminPocetnaService.getMonthlyRentalTrends().subscribe({
      next: (trends) => {
        this.monthlyData = trends;
        console.log('📈 Mesečne statistike:', this.monthlyData);
        this.statsLoading = false;
        this.chartLoading = false;

        // Kreiraj chart nakon što se učitaju podaci
        setTimeout(() => {
          this.createRentalTrendChart();
        }, 100);
      },
      error: (err) => {
        console.error('Greška pri učitavanju mesečnih trendova:', err);
        this.monthlyData = [];
        this.statsLoading = false;
        this.chartLoading = false;
      }
    });
  }

  createRentalTrendChart(): void {
    const canvas = document.getElementById('rentalTrendChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('❌ Canvas element nije pronađen!');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Context nije pronađen!');
      return;
    }

    console.log('📊 Kreiram chart sa podacima:', this.monthlyData);

    // Uništi prethodni chart ako postoji
    if (this.rentalTrendChart) {
      this.rentalTrendChart.destroy();
    }

    this.rentalTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyData.map(d => d.month),
        datasets: [{
          label: 'Broj iznajmljivanja',
          data: this.monthlyData.map(d => d.count),
          borderColor: '#fb923c',
          backgroundColor: 'rgba(251, 146, 60, 0.15)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fb923c',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#0f172a',
              font: {
                size: 13,
                weight: 'bold' as const
              },
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            displayColors: false,
            titleFont: {
              size: 14,
              weight: 'bold' as const
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => `Iznajmljivanja: ${item.parsed.y}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: '#64748b',
              font: {
                size: 12,
                weight: 600
              }
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.15)',
              lineWidth: 1
            },
            border: {
              display: true,
              color: 'rgba(148, 163, 184, 0.2)'
            }
          },
          x: {
            ticks: {
              color: '#64748b',
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 11,
                weight: 600
              }
            },
            grid: {
              display: false
            },
            border: {
              display: true,
              color: 'rgba(148, 163, 184, 0.2)'
            }
          }
        }
      }
    });

    console.log('✅ Chart uspešno kreiran!');
  }

  updateChart(): void {
    if (!this.rentalTrendChart) return;

    this.rentalTrendChart.data.labels = this.monthlyData.map(d => d.month);
    this.rentalTrendChart.data.datasets[0].data = this.monthlyData.map(d => d.count);
    this.rentalTrendChart.update();
  }

  // Films Management Methods
  loadFilms(): void {
    this.filmsLoading = true;
    this.gostPocetnaService.getAllFilms().subscribe({
      next: (films: Film[]) => {
        this.allFilms = films;
        this.filteredFilms = films;
        this.filmsLoading = false;
        console.log('📽️ Učitano filmova:', films.length);
      },
      error: (err) => {
        console.error('Greška pri učitavanju filmova:', err);
        this.filmsLoading = false;
      }
    });
  }

  searchFilms(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.filteredFilms = this.allFilms;
      return;
    }

    // Pretraga SAMO po nazivu filma
    this.filteredFilms = this.allFilms.filter(film =>
      film.naslov.toLowerCase().includes(query)
    );

    console.log('🔍 Pronađeno filmova:', this.filteredFilms.length);
  }

  editFilm(filmId: string): void {
    // Navigacija ka stranici za izmenu filma
    this.router.navigate(['/admin/edit-film', filmId]);
    console.log('✏️ Izmena filma ID:', filmId);
  }

  addNewFilm(): void {
    // Navigacija ka stranici za dodavanje novog filma
    this.router.navigate(['/admin/add-film']);
    console.log('➕ Dodavanje novog filma');
  }

  deleteFilm(filmId: string): void {
    const film = this.allFilms.find(f => f._id === filmId);

    if (!film) {
      console.error('Film nije pronađen!');
      return;
    }

    const confirmDelete = confirm(`Da li ste sigurni da želite da obrišete film "${film.naslov}"?`);

    if (confirmDelete) {
      console.log('🗑️ Brisanje filma:', film.naslov);

      this.adminPocetnaService.deleteFilm(filmId).subscribe({
        next: (response) => {
          console.log('✅ Film uspešno obrisan:', response);

          // Ukloni iz liste
          this.allFilms = this.allFilms.filter(f => f._id !== filmId);
          this.searchFilms(); // Osveži filtered listu
          this.totalFilms--; // Ažuriraj statistiku

          alert(`Film "${film.naslov}" je uspešno obrisan!`);
        },
        error: (err) => {
          console.error('❌ Greška pri brisanju filma:', err);
          alert('Greška pri brisanju filma. Pokušajte ponovo.');
        }
      });
    }
  }

  loadPendingRequests(): void {
    this.registrationService.getPendingRequests().subscribe({
      next: (requests) => {
        this.pendingRequests = requests.length;
      },
      error: (err) => {
        console.error('Error loading pending requests:', err);
        this.pendingRequests = 0;
      }
    });
  }

  // Load all rentals and compute currently active ones
  loadAllRentals(): void {
    this.adminPocetnaService.getAllRentals().subscribe({
      next: (rentals: Iznajmljivanje[]) => {
        this.allRentals = rentals || [];
        console.log("Sva iznajmljivanja:",this.allRentals)
        const now = new Date();
        // Robust active detection: prefer datumVracanja if present, otherwise use brojDana to compute expected end
        this.activeRentalsList = this.allRentals.filter(r => {
          try {
            const start = r.datumIznajmljivanja ? new Date(r.datumIznajmljivanja) : null;
            const ret = r.datumVracanja ? new Date(r.datumVracanja) : null;
            console.log("Pocetak:",start)
            console.log("Kraj:",ret)
            console.log("Trenutno:",now)
            if (ret && !isNaN(ret.getTime())) {
              let rezultat = ret > now && start && start <= now;
              console.log(rezultat)
              return ret > now && start && start <= now;
            }

            if (start && typeof r.brojDana === 'number') {
              const expected = new Date(start);
              expected.setDate(expected.getDate() + r.brojDana);
              return start <= now && now < expected;
            }

            // fallback: if only start exists, consider active if start <= now
            return start ? (start <= now) : false;
          } catch (e) {
            return false;
          }
        });

        // update count and log
        this.activeRentals = this.activeRentalsList.length;
        console.log('🔁 Učitano iznajmljivanja:', this.allRentals.length, 'aktivna:', this.activeRentals);
      },
      error: (err) => {
        console.error('Greška pri učitavanju svih iznajmljivanja:', err);
        this.allRentals = [];
        this.activeRentalsList = [];
        this.activeRentals = 0;
      }
    });
  }

  viewRegistrationRequests(): void {
    this.router.navigate(['/admin/registration-requests']);
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login-admin']);
  }

  ngOnDestroy(): void {
    // Cleanup chart
    if (this.rentalTrendChart) {
      this.rentalTrendChart.destroy();
    }
  }
}
