import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvitationService } from '../../services/invitation.service';
import { SendInvitation } from '../../models/invitation.model';

@Component({
  selector: 'app-invitation-send',
  templateUrl: './invitation-send.component.html'
})
export class InvitationSendComponent {
  invitationData: SendInvitation = {
    studyGroupId: 0,
    inviterUserId: 1, // TODO: Replace with the actual logged-in user ID dynamically
    inviteeUserId: 0
  };

  constructor(
    private invitationService: InvitationService,
    private route: ActivatedRoute
  ) {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    this.invitationData.studyGroupId = groupId ? +groupId : 0;
  }

  sendInvitation(): void {
    if (!this.invitationData.inviteeUserId) {
      alert('Please enter a valid Invitee User ID.');
      return;
    }

    this.invitationService.sendInvitation(this.invitationData)
      .subscribe({
        next: () => alert('Invitation sent!'),
        error: err => console.error('Failed to send invitation:', err)
      });
  }
}
