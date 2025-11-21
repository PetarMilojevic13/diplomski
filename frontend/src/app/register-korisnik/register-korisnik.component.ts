import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { RegistrationService } from '../servisi/registration.service';

@Component({
  selector: 'app-register-korisnik',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-korisnik.component.html',
  styleUrls: ['./register-korisnik.component.css']
})
export class RegisterKorisnikComponent {
  private registrationService = inject(RegistrationService);

  user: User = new User();
  confirmPassword = '';
  error = '';
  success = '';
  selectedFile: File | null = null;
  selectedFileName = '';

  constructor(private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.selectedFileName = file.name;

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        this.user.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Clear selection if no file
      this.selectedFile = null;
      this.selectedFileName = '';
      this.user.profileImage = '';
    }
  }

  register() {
    // Reset messages
    this.error = '';
    this.success = '';

    // Validation - korisničko ime
    if (!this.user.kor_ime || this.user.kor_ime.trim().length < 3) {
      this.error = 'Korisničko ime mora imati minimum 3 karaktera';
      return;
    }

    // Validation - lozinka
    if (!this.user.lozinka || this.user.lozinka.length < 6) {
      this.error = 'Lozinka mora imati minimum 6 karaktera';
      return;
    }

    // Validation - potvrda lozinke
    if (!this.confirmPassword) {
      this.error = 'Morate potvrditi lozinku';
      return;
    }

    if (this.user.lozinka !== this.confirmPassword) {
      this.error = 'Lozinke se ne podudaraju';
      return;
    }

    // Validation - ime
    if (!this.user.ime || this.user.ime.trim().length === 0) {
      this.error = 'Ime je obavezno polje';
      return;
    }

    // Validation - prezime
    if (!this.user.prezime || this.user.prezime.trim().length === 0) {
      this.error = 'Prezime je obavezno polje';
      return;
    }

    // Validation - pol
    if (!this.user.pol) {
      this.error = 'Morate izabrati pol';
      return;
    }

    // Validation - adresa
    if (!this.user.adresa || this.user.adresa.trim().length === 0) {
      this.error = 'Adresa je obavezno polje';
      return;
    }

    // Validation - telefon
    if (!this.user.telefon || this.user.telefon.trim().length === 0) {
      this.error = 'Kontakt telefon je obavezan';
      return;
    }

    // Validation - email
    if (!this.user.email || this.user.email.trim().length === 0) {
      this.error = 'E-mail adresa je obavezna';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.error = 'Unesite validnu email adresu';
      return;
    }

    // Kreiraj korisnika (će biti kreiran sa status=0 na backendu)
    const userData: Partial<User> = {
      kor_ime: this.user.kor_ime.trim(),
      lozinka: this.user.lozinka,
      ime: this.user.ime.trim(),
      prezime: this.user.prezime.trim(),
      pol: this.user.pol,
      adresa: this.user.adresa.trim(),
      telefon: this.user.telefon.trim(),
      email: this.user.email.trim(),
      profileImage: this.user.profileImage || ''
    };

    // Pošalji zahtev
    this.registrationService.submitRegistrationRequest(userData).subscribe({
      next: (response) => {
        console.log('✅ Zahtev za registraciju uspešno poslat:', response);

        // Prikaži SUCCESS poruku
        this.success = '✅ Zahtev za registraciju je uspešno poslat! Administrator će ga razmotriti uskoro. Preusmereavanje na stranicu za prijavu...';
        this.error = '';

        // Scroll to top da vidi poruku
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Redirekcija nakon 3 sekunde
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        console.error('❌ Greška pri registraciji:', err);

        // Prikaži ERROR poruku - ostaje na strani za registraciju
        this.error = err.message || 'Došlo je do greške prilikom slanja zahteva. Pokušajte ponovo.';
        this.success = '';

        // Scroll to top da vidi grešku
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
