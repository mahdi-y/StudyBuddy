import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

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
    console.log(`Sending request to ${environment.authApiUrl}/request-reset with username:`, this.username);
    this.http.post(`${environment.authApiUrl}/request-reset`, this.username)
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
