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
    inviterUserId: 1, // Replace with logged-in user dynamically
    inviteeUserId: 0,
    studyGroup: { id: 0 },
    status: 'PENDING',
    type: 'INVITE'
  };

  constructor(
    private invitationService: InvitationService,
    private route: ActivatedRoute
  ) {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    this.invitationData.studyGroup.id = groupId ? +groupId : 0;
  }

  sendInvitation(): void {
    if (!this.invitationData.inviteeUserId) {
      alert('Please enter a valid Invitee User ID.');
      return;
    }

    this.invitationService.sendInvitation(this.invitationData).subscribe({
      next: () => alert('Invitation sent!'),
      error: err => console.error('Failed to send invitation:', err)
    });
  }
}
