import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of, delay, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginKorisnikServiceService {

  constructor() { }

  private http = inject(HttpClient)

  private backPath = "http://localhost:8080"

  loginKorisnik(username: string, password: string): Observable<User | null> {
    const data = {
      username: username,
      password: password
    };

    return this.http.post<any>(`${this.backPath}/api/auth/login/korisnik`, data);
  }
}
