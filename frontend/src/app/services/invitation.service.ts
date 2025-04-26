import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendInvitation, Invitation } from '../models/invitation.model'; // ✅ import both types

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private apiUrl = 'http://localhost:8081/api/invitations'; // Base URL for invitations API
  private notificationApiUrl = 'http://localhost:8081/api/notifications/send'; // Base URL for email notifications

  constructor(private http: HttpClient) {}

  /**
   * Sends an invitation to join a study group.
   * @param invitation The invitation details.
   * @returns An observable of the HTTP POST response.
   */
  sendInvitation(invitation: SendInvitation): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, invitation);
  }

  /**
   * Sends an email notification to the invitee.
   * @param groupName The name of the study group.
   * @param recipientEmail The email of the invitee.
   * @returns An observable of the HTTP POST response.
   */
  sendEmail(groupName: string, recipientEmail: string): Observable<any> {
    // Create the request URL with query parameters
    const url = `${this.notificationApiUrl}?groupName=${groupName}&recipientEmail=${recipientEmail}`;
    
    // Use the correct instance of HttpClient
    return this.http.post(url, {}); // Sending an empty object if needed for POST
  }

  /**
   * Fetches all invitations for a specific user.
   * @param userId The ID of the user.
   * @returns An observable of the HTTP GET response containing the invitations.
   */
  getUserInvitations(userId: number): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Fetches all invitations.
   * @returns An observable of the HTTP GET response containing all invitations.
   */
  getAllInvitations(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(this.apiUrl);
  }
}
