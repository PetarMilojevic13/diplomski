import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {

  constructor() { }

  private http = inject(HttpClient)

  private backPath = "http://localhost:8080"

  loginAdmin(username: string, password: string): Observable<User | null> {
    const data = {
      username: username,
      password: password
    };

    return this.http.post<any>(`${this.backPath}/api/auth/login/admin`, data).pipe(
      map(response => {
        if (response.success && response.user) {
          console.log('✅ Admin login uspešan za:', username);
          return response.user;
        }
        return null;
      }),
      catchError(error => {
        console.error('❌ Admin login neuspešan:', error.error?.message || 'Greška na serveru');
        return of(null);
      })
    );
  }
}
