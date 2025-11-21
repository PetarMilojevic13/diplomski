import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginAdminService } from '../services/login-admin.service';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  username = '';
  password = '';
  error = '';
  private adminService = inject(LoginAdminService);
  constructor(private router: Router) {}

  login() {
    // Reset greške
    this.error = '';

    // Validacija na klijentskoj strani
    if (!this.username || !this.password) {
      this.error = 'Korisničko ime i lozinka su obavezni!';
      return;
    }

    this.adminService.loginAdmin(this.username, this.password).subscribe({
      next: (data) => {
        if (data != null) {
          console.log('✅ Admin uspešno prijavljen:', data);
          localStorage.setItem('loggedUser', JSON.stringify(data));
          this.router.navigate(['/admin']);
        } else {
          this.error = 'Pogrešno korisničko ime ili lozinka, ili nemate admin privilegije!';
        }
      },
      error: (err) => {
        console.error('❌ Greška pri login-u:', err);
        this.error = 'Došlo je do greške. Proverite da li ste uneli validne podatke i da imate admin privilegije.';
      }
    });
  }
}
