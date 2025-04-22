import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import {  LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  msg: string | undefined;

  constructor(
    private authService: AuthService,
    private storage: LocalStorageService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const request: LoginRequest = this.loginForm.value;
      this.authService.login(request).subscribe({
        next: (res: LoginResponse) => {
          if (res.token) {
            this.storage.set('auth-token', res.token);
            const user = this.authService.getCurrentUser();
            if (user?.role === 'ADMIN') {
              this.router.navigate(['/backoffice']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.msg = 'Login failed: No token received';
          }
        },
        error: (err) => {
          this.msg = 'Login failed: ' + (err.error.message || 'Invalid credentials');
          console.log("Error Received:", err);
        }
      });
    } else {
      this.msg = 'Please fill all required fields.';
    }
  }
}