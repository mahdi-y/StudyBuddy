import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvitationService } from '../../services/invitation.service';
import { SendInvitation } from '../../models/invitation.model';
import { UserService } from '../../services/user.service';  // Assuming you have a user service to get user info by email

@Component({
  selector: 'app-invitation-send',
  templateUrl: './invitation-send.component.html'
})
export class InvitationSendComponent {
  invitationData: SendInvitation = {
    inviterUserId: 1, // Replace with logged-in user dynamically
    inviteeUserId: 0, // Will be set dynamically
    inviteeEmail: '', // Will hold email if provided
    studyGroup: { id: 0 },
    status: 'PENDING',
    type: 'INVITE'
  };

  constructor(
    private invitationService: InvitationService,
    private userService: UserService, // Assuming you have a service to get user info by email
    private route: ActivatedRoute
  ) {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    this.invitationData.studyGroup.id = groupId ? +groupId : 0;
  }

  sendInvitation(): void {
    // Check if the invitee is an email or a user ID
    if (!this.invitationData.inviteeUserId && !this.invitationData.inviteeEmail) {
      alert('Please provide a valid Invitee User ID or Email.');
      return;
    }

    if (this.invitationData.inviteeEmail) {
      // If the invitee is an email, get the corresponding user ID
      this.userService.getUserIdByEmail(this.invitationData.inviteeEmail).subscribe({
        next: userId => {
          // Set the inviteeUserId based on email lookup
          this.invitationData.inviteeUserId = userId;

          this.sendInvitationRequest();
        },
        error: err => {
          console.error('Failed to find user by email:', err);
          alert('Failed to resolve email to user ID.');
        }
      });
    } else {
      // If the invitee is a user ID, proceed directly
      this.sendInvitationRequest();
    }
  }

  private sendInvitationRequest(): void {
    // Now send the invitation
    this.invitationService.sendInvitation(this.invitationData).subscribe({
      next: () => alert('Invitation sent!'),
      error: err => console.error('Failed to send invitation:', err)
    });
  }
}
