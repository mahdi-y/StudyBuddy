import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendInvitation } from '../models/invitation.model'; // adjust the path if needed

export interface Invitation {
  studyGroupId: number;
  inviterUserId: number;
  inviteeUserId: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private apiUrl = 'http://localhost:8080/api/invitations'; // Replace this

  constructor(private http: HttpClient) {}


  sendInvitation(invitation: SendInvitation): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, invitation);
  }
  getUserInvitations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
  
}
