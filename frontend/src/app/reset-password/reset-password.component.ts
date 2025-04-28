import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  username: string = '';
  resetCode: string = '';
  newPassword: string = '';
  message: string = '';
  isSuccess: boolean = false;
  confirmPassword: string = '';
  isPasswordMatch: boolean = true;
error: any;
  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {
    const resetData = {
      username: this.username,
      resetCode: this.resetCode,
      newPassword: this.newPassword
    };

    this.http.post('http://localhost:8083/api/auth/reset-password', resetData)
      .subscribe({
        next: (response: any) => {
          this.isSuccess = true;
          this.message = 'Password reset successful! Redirecting...';
          
          // Navigate after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isSuccess = false;
          this.message = `Error: ${error.status} - ${error.error || 'Failed to reset password'}`;
        }
      });
  }
}