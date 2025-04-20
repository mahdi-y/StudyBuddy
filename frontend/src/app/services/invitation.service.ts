import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendInvitation, Invitation } from '../models/invitation.model'; // ✅ import both types

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private apiUrl = 'http://localhost:8081/api/invitations'; // Replace this with your actual API URL

  constructor(private http: HttpClient) {}

  sendInvitation(invitation: SendInvitation): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, invitation);
  }

  getUserInvitations(userId: number): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAllInvitations(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(this.apiUrl);
  }
}
