import { Component } from '@angular/core';
import { InvitationService } from '../../services/invitation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invitation-send',
  templateUrl: './invitation-send.component.html'
})
export class InvitationSendComponent {
  invitationData = {
    studyGroupId: 0,
    inviterUserId: 1, // Replace with actual user ID
    inviteeUserId: 0
  };

  constructor(
    private invitationService: InvitationService,
    private route: ActivatedRoute
  ) {
    this.invitationData.studyGroupId = +this.route.snapshot.params['groupId'];
  }

  sendInvitation(): void {
    this.invitationService.sendInvitation(this.invitationData)
      .subscribe(() => alert('Invitation sent!'));
  }
}