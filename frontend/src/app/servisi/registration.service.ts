import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private backPath = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  // Provera da li korisničko ime već postoji
  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<any>(`${this.backPath}/api/registration/check-username/${username}`).pipe(
      map(response => !response.available), // Ako nije available, znači da postoji
      catchError(error => {
        console.error('Greška pri proveri korisničkog imena:', error);
        return of(false); // U slučaju greške, pretpostavljamo da ne postoji
      })
    );
  }

  // Provera da li email već postoji
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<any>(`${this.backPath}/api/registration/check-email/${email}`).pipe(
      map(response => !response.available), // Ako nije available, znači da postoji
      catchError(error => {
        console.error('Greška pri proveri email-a:', error);
        return of(false); // U slučaju greške, pretpostavljamo da ne postoji
      })
    );
  }

  // Podnošenje zahteva za registraciju (kreira korisnika sa status=0)
  submitRegistrationRequest(userData: Partial<User>): Observable<any> {
    const data = {
      kor_ime: userData.kor_ime,
      lozinka: userData.lozinka,
      ime: userData.ime,
      prezime: userData.prezime,
      pol: userData.pol,
      adresa: userData.adresa,
      telefon: userData.telefon,
      email: userData.email,
      profileImage: userData.profileImage || ''
    };

    return this.http.post<any>(`${this.backPath}/api/registration/register`, data).pipe(
      map(response => {
        if (response.success) {
          console.log('✅ Zahtev za registraciju uspešno poslat');
          return response;
        }
        throw new Error(response.message || 'Greška pri registraciji');
      }),
      catchError(error => {
        console.error('❌ Greška pri registraciji:', error);
        const message = error.error?.message || 'Došlo je do greške pri registraciji!';
        return throwError(() => new Error(message));
      })
    );
  }

  // Admin: Dobijanje svih pending korisnika (status=0)
  getAllRequests(): Observable<User[]> {
    return this.http.get<any>(`${this.backPath}/api/registration/admin/requests`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Greška pri dobijanju pending korisnika:', error);
        return of([]);
      })
    );
  }

  // Admin: Dobijanje pending korisnika (status = 0)
  getPendingRequests(): Observable<User[]> {
    return this.http.get<any>(`${this.backPath}/api/registration/admin/pending`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Greška pri dobijanju pending korisnika:', error);
        return of([]);
      })
    );
  }

  // Admin: Odobravanje korisnika (status: 0 -> 1)
  approveRequest(userId: string, adminUsername: string): Observable<User> {
    return this.http.post<any>(`${this.backPath}/api/registration/admin/approve/${userId}`, {
      adminUsername
    }).pipe(
      map(response => {
        if (response.success) {
          console.log('✅ Korisnik uspešno odobren');
          return response.data;
        }
        throw new Error(response.message || 'Greška pri odobravanju korisnika');
      }),
      catchError(error => {
        console.error('❌ Greška pri odobravanju korisnika:', error);
        const message = error.error?.message || 'Došlo je do greške pri odobravanju korisnika!';
        return throwError(() => new Error(message));
      })
    );
  }

  // Admin: Odbijanje korisnika (briše korisnika)
  rejectRequest(userId: string, adminUsername: string, reason?: string): Observable<boolean> {
    return this.http.post<any>(`${this.backPath}/api/registration/admin/reject/${userId}`, {
      adminUsername,
      reason: reason || 'Razlog nije naveden'
    }).pipe(
      map(response => {
        if (response.success) {
          console.log('✅ Korisnik uspešno odbijen');
          return true;
        }
        throw new Error(response.message || 'Greška pri odbijanju korisnika');
      }),
      catchError(error => {
        console.error('❌ Greška pri odbijanju korisnika:', error);
        const message = error.error?.message || 'Došlo je do greške pri odbijanju korisnika!';
        return throwError(() => new Error(message));
      })
    );
  }
}
