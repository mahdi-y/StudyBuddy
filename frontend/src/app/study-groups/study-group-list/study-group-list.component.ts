import { Component, OnInit } from '@angular/core';
import { StudyGroupService } from '../../services/study-group.service';
import { InvitationService } from '../../services/invitation.service';
import { Router } from '@angular/router';
import { StudyGroup } from '../../models/study-group.model';
import { SendInvitation } from '../../models/invitation.model';
import { ToastrService } from 'ngx-toastr'; // Optional: For toast notifications

@Component({
  selector: 'app-study-group-list',
  templateUrl: './study-group-list.component.html',
  styleUrls: ['./study-group-list.component.css']
})
export class StudyGroupListComponent implements OnInit {

  studyGroups: StudyGroup[] = [];

  // Temporary static values – replace with real logic (e.g., from auth service or form)
  currentUserId: number = 1;  // inviter
  selectedInviteeUserId: number = 2;  // invitee

  constructor(
    private studyGroupService: StudyGroupService,
    private invitationService: InvitationService,
    private router: Router, // For navigation
    private toastr: ToastrService // Optional: For toast notifications
  ) {}

  ngOnInit(): void {
    // Load all study groups on component initialization
    this.studyGroupService.getStudyGroups().subscribe((data) => {
      this.studyGroups = data;
    });
  }

  // Send an invitation to the selected member for the group
  sendInvitation(groupId: number): void {
    const invitation: SendInvitation = {
      studyGroupId: groupId,
      inviterUserId: this.currentUserId,
      inviteeUserId: this.selectedInviteeUserId
    };

    this.invitationService.sendInvitation(invitation).subscribe(
      response => {
        console.log('Invitation sent to group ID:', groupId, response);
        this.toastr.success('Invitation sent successfully!');
      },
      error => {
        console.error('Error sending invitation:', error);
        this.toastr.error('Failed to send invitation');
      }
    );
  }

  // Navigate to the create new study group page
  goToCreateGroup(): void {
    this.router.navigate(['/groups/new']);
  }

  // Navigate to the update page of a selected study group
  goToUpdateGroup(groupId: number): void {
    this.router.navigate([`/groups/update-group/${groupId}`]);  // Navigate to update route with the group's ID
  }
  

  // Delete the selected study group
  deleteStudyGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this study group?')) {
      this.studyGroupService.deleteStudyGroup(groupId).subscribe({
        next: () => {
          this.toastr.success('Study group deleted successfully!');
          // Remove the deleted group from the list without needing to reload
          this.studyGroups = this.studyGroups.filter(group => group.id !== groupId);
        },
        error: (err) => {
          this.toastr.error('Failed to delete study group');
          console.error(err);
        }
      });
    }
  }
}
