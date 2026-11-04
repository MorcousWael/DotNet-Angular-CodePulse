import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { AuthRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Initialize signals from localStorage for session persistence
  private tokenSignal = signal<string | null>(localStorage.getItem('auth_token'));
  private emailSignal = signal<string | null>(localStorage.getItem('auth_email'));
  private rolesSignal = signal<string[]>(JSON.parse(localStorage.getItem('auth_roles') || '[]'));

  // Public computed signals for components to read
  token = this.tokenSignal.asReadonly();
  email = this.emailSignal.asReadonly();
  roles = this.rolesSignal.asReadonly();

  isLoggedIn = computed(() => !!this.tokenSignal());
  isWriter = computed(() => this.rolesSignal().includes('Writer'));

  // Login Method
  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/api/Auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.saveSession(response);
        }),
      );
  }

  // Register Method (Returns void or empty since response has content-length: 0)
  register(credentials: AuthRequest): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/Auth/register`, credentials, {
      responseType: 'text', // Handles empty or plain text success responses from ASP.NET Core
    });
  }

  // Logout Method
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_roles');

    this.tokenSignal.set(null);
    this.emailSignal.set(null);
    this.rolesSignal.set([]);
  }

  // Helper to persist session storage
  private saveSession(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_email', response.email);
    localStorage.setItem('auth_roles', JSON.stringify(response.roles));

    this.tokenSignal.set(response.token);
    this.emailSignal.set(response.email);
    this.rolesSignal.set(response.roles);
  }
}
