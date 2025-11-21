import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginKorisnikServiceService } from '../services/login-korisnik-service.service';

@Component({
  selector: 'app-login-korisnik',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-korisnik.component.html',
  styleUrls: ['./login-korisnik.component.css']
})
export class LoginKorisnikComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  private userService = inject(LoginKorisnikServiceService);

  constructor(private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;

    this.userService.loginKorisnik(this.username, this.password).subscribe({
      next: (data) => {
        this.loading = false;
        if (data != null) {
          this.error = "";
          localStorage.setItem("loggedUser", JSON.stringify(data));
          this.router.navigate(["/korisnik"]);
        } else {
          this.error = "Neispravno korisničko ime ili lozinka";
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);

        // Proveri status kod
        if (err.status === 401) {
          this.error = "⚠️ Neispravno korisničko ime ili lozinka";
        } else if (err.status === 403) {
          // Korisnik postoji ali čeka odobrenje (status=0)
          this.error = "⏳ Vaš nalog čeka odobrenje administratora. Molimo sačekajte.";
        } else if (err.status === 400) {
          this.error = "⚠️ Molimo popunite sva polja";
        } else {
          this.error = "⚠️ Došlo je do greške pri prijavljivanju";
        }
      }
    });
  }

  nastaviKaoGost() {
    localStorage.removeItem("loggedUser");
    this.router.navigate(['/gost']);
  }
}
