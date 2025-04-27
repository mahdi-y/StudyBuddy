import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequest } from '../models/signup-request';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { SignupResponse } from '../models/signup-response';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8083/api';

  constructor(private http: HttpClient, private storage: LocalStorageService) {}

  register(request: SignupRequest): Observable<SignupResponse> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify({
      name: request.name,
      username: request.username,
      password: request.password,
      address: request.address,
      mobileno: request.mobileno,
      age: request.age
    })], { type: 'application/json' }));
    if (request.profilePicture) {
      formData.append('profilePicture', request.profilePicture);
    }
    return this.http.post<SignupResponse>(`${this.apiUrl}/doRegister`, formData);
  }

  login(username: string, password: string, request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/doLogin`, request);
  }

  getCurrentUser(): { username: string; role: string; } | null {
    const token = this.storage.get('auth-token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { username: payload.sub, role: payload.role };
    } catch (e) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.storage.get('auth-token');
  }

  logout(): void {
    this.storage.remove('auth-token');
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/forgotPassword`, email, { responseType: 'text' as 'json' });
  }

  validateResetToken(token: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/validateResetToken`, { params: { token }, responseType: 'text' as 'json' });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/resetPassword`, { token, newPassword }, { responseType: 'text' as 'json' });
  }
}