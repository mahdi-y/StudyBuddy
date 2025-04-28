import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html'
})
export class RequestResetComponent {
  username: string = '';
  message: string = '';
msg: any;
error: any;

  constructor(private http: HttpClient) {}

  requestReset() {
    console.log('Sending request to http://localhost:8083/api/auth/request-reset with username:', this.username);
    this.http.post('http://localhost:8083/api/auth/request-reset', this.username)
      .subscribe({
        next: (response: any) => {
          this.message = response;
        },
        error: (error) => {
          console.error('Request failed:', error);
          this.message = 'Error: ' + error.error;
        }
      });
  }
}