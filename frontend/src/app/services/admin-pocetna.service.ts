import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Iznajmljivanje } from '../models/iznajmljivanje';

@Injectable({
  providedIn: 'root'
})
export class AdminPocetnaService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.apiUrl}/users`)
      .pipe(map(response => response.data || response));
  }

  // Get user statistics
  getUserStatistics(): Observable<{ totalUsers: number, activeUsers: number, deactivatedUsers: number }> {
    return this.http.get<any>(`${this.apiUrl}/users/statistics`)
      .pipe(map(response => response.data));
  }

  // Get all rentals (admin view)
  getAllRentals(): Observable<Iznajmljivanje[]> {
    return this.http.get<any>(`${this.apiUrl}/iznajmljivanja`)
      .pipe(map(response => response.data));
  }

  // Get rental statistics
  getRentalStatistics(): Observable<{
    totalRentals: number,
    activeRentals: number,
    returnedRentals: number,
    cancelledRentals: number
  }> {
    return this.http.get<any>(`${this.apiUrl}/iznajmljivanja/admin/statistics`)
      .pipe(map(response => response.data));
  }

  // Get monthly rental trends
  getMonthlyRentalTrends(): Observable<{ month: string, count: number }[]> {
    return this.http.get<any>(`${this.apiUrl}/iznajmljivanja/admin/monthly-trends`)
      .pipe(map(response => response.data));
  }

  // Delete film (admin only)
  deleteFilm(filmId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/films/${filmId}`);
  }
}
