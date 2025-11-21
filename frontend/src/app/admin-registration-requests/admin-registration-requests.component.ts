import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { RegistrationService } from '../servisi/registration.service';

@Component({
  selector: 'app-admin-registration-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-registration-requests.component.html',
  styleUrl: './admin-registration-requests.component.css'
})
export class AdminRegistrationRequestsComponent implements OnInit {
  private registrationService = inject(RegistrationService);
  private router = inject(Router);

  pendingUsers: User[] = [];
  loading: boolean = true;
  error: string = '';
  success: string = '';

  selectedUser: User | null = null;
  showDetailsModal: boolean = false;

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';

    this.registrationService.getPendingRequests().subscribe({
      next: (users) => {
        this.pendingUsers = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pending users:', err);
        this.error = 'Greška prilikom učitavanja pending korisnika.';
        this.loading = false;
      }
    });
  }

  viewDetails(user: User): void {
    this.selectedUser = user;
    this.showDetailsModal = true;
  }

  closeModal(): void {
    this.showDetailsModal = false;
    this.selectedUser = null;
  }

  approveRequest(user: User): void {
    if (!confirm(`Da li ste sigurni da želite da odobrite korisnika "${user.kor_ime}"?`)) {
      return;
    }

    console.log('🔄 Odobravanje korisnika:', user._id);

    this.registrationService.approveRequest(user._id!, 'admin').subscribe({
      next: (approvedUser) => {
        console.log('✅ User approved:', approvedUser);
        this.success = `Korisnik "${user.kor_ime}" je uspešno odobren!`;
        this.error = '';
        this.loadRequests(); // Reload list

        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err) => {
        console.error('❌ Error approving user:', err);
        console.error('❌ Error details:', err.message, err.error);
        this.error = `Greška prilikom odobravanja korisnika: ${err.message || 'Nepoznata greška'}`;
        this.success = '';
      }
    });
  }

  rejectRequest(user: User): void {
    const reason = prompt(`Razlog odbijanja korisnika "${user.kor_ime}" (opciono):`);

    if (reason === null) {
      return; // User canceled
    }

    if (!confirm(`Da li ste sigurni da želite da odbijete korisnika "${user.kor_ime}"? Korisnik će biti potpuno obrisan.`)) {
      return;
    }

    this.registrationService.rejectRequest(user._id!, 'admin', reason || undefined).subscribe({
      next: () => {
        this.success = `Korisnik "${user.kor_ime}" je odbijen i obrisan.`;
        this.error = '';
        this.loadRequests(); // Reload list

        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error rejecting user:', err);
        this.error = 'Greška prilikom odbijanja korisnika.';
        this.success = '';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
