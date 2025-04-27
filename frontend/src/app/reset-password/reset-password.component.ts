import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  username: string = '';
  resetCode: string = '';
  newPassword: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  resetPassword() {
    const request = {
      username: this.username,
      resetCode: this.resetCode,
      newPassword: this.newPassword
    };

    console.log('Sending request to http://localhost:8083/api/auth/reset-password with payload:', request);
    this.http.post('http://localhost:8083/api/auth/reset-password', request)
      .subscribe({
        next: (response: any) => {
          this.message = response;
          console.log('Response:', response);
        },
        error: (error) => {
          console.error('Request failed:', error);
          this.message = `Error: ${error.status} - ${error.statusText} - ${error.error || 'No error details'}`;
        }
      });
  }
}