import { Component, OnInit } from '@angular/core';
import { InvitationService } from '../../services/invitation.service';
import { Invitation } from '../../models/invitation.model';

@Component({
  selector: 'app-invitation-list',
  templateUrl: './invitation-list.component.html'
})
export class InvitationListComponent implements OnInit {
  invitations: Invitation[] = [];
  currentUserId = 1; // Replace with actual user ID

  constructor(private invitationService: InvitationService) {}

  ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations(): void {
    this.invitationService.getUserInvitations(this.currentUserId)
      .subscribe(invitations => this.invitations = invitations);
  }

  respondToInvitation(invitationId: number, response: 'ACCEPTED' | 'REJECTED'): void {
    // Implement response logic
  }
}