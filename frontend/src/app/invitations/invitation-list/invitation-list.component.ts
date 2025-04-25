import { Component, OnInit } from '@angular/core';
import { InvitationService } from '../../services/invitation.service';
import { Invitation } from '../../models/invitation.model';


@Component({
  selector: 'app-invitation-list',
  templateUrl: './invitation-list.component.html',
  styleUrls: ['./invitation-list.component.css']
})
export class InvitationListComponent implements OnInit {
  invitations: Invitation[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private invitationService: InvitationService) {}

  ngOnInit(): void {
    this.fetchInvitations();
  }

  fetchInvitations(): void {
    this.invitationService.getAllInvitations().subscribe({
      next: (data) => {
        this.invitations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching invitations', err);
        this.errorMessage = 'Failed to load invitations. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
