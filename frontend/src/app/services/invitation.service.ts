import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private apiUrl = 'https://api.yoursite.com/invitation';  // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  sendInvitation(groupId: number): Observable<any> {
    // Make a POST request to send the invitation
    return this.http.post<any>(`${this.apiUrl}/send`, { groupId });
  }
}
