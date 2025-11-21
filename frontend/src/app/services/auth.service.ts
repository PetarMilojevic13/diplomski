import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage on init
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  // Get current user
  getCurrentUser(): any {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Login
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/korisnici/login`, { username, password })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
          }
        })
      );
  }

  // Register
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/korisnici/register`, userData);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Get user profile
  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/korisnici/${userId}`);
  }

  // Update user profile
  updateProfile(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/korisnici/${userId}`, userData);
  }
}
