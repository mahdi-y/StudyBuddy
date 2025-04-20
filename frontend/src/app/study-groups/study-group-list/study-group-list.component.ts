import { Component, OnInit } from '@angular/core';
import { StudyGroupService } from '../../services/study-group.service';
import { InvitationService } from '../../services/invitation.service';
import { Router } from '@angular/router';
import { StudyGroup } from '../../models/study-group.model';
import { SendInvitation } from '../../models/invitation.model';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-study-group-list',
  templateUrl: './study-group-list.component.html',
  styleUrls: ['./study-group-list.component.scss']
})
export class StudyGroupListComponent implements OnInit {
  studyGroups: StudyGroup[] = [];
  selectedGroup: StudyGroup | null = null;
  selectedDetailGroup: StudyGroup | null = null;
  searchTerm: string = '';
  isSidebarCollapsed: boolean = false;
  showProfileDropdown: boolean = false;
  showAllGroups: boolean = false;

  currentUserId: number = 1;
  selectedInviteeUserId: number = 2;

  modal: bootstrap.Modal | null = null;  // Hold reference to the modal

  constructor(
    private studyGroupService: StudyGroupService,
    private invitationService: InvitationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.studyGroupService.getStudyGroups().subscribe((data) => {
      this.studyGroups = data;
      if (this.studyGroups.length > 0) {
        this.selectedGroup = this.studyGroups[0];
      }
    });
  }

  sendInvitation(groupId: number): void {
    const invitation: SendInvitation = {
      studyGroup: { id: groupId },
      inviterUserId: this.currentUserId,
      inviteeUserId: this.selectedInviteeUserId
    };

    this.invitationService.sendInvitation(invitation).subscribe({
      next: (response) => {
        console.log('Invitation sent to group ID:', groupId, response);
        this.toastr.success('Invitation sent successfully!');
      },
      error: (error) => {
        console.error('Error sending invitation:', error);
        this.toastr.error('Failed to send invitation');
      }
    });
  }

  goToCreateGroup(): void {
    this.router.navigate(['/groups/new']);
  }

  toggleStudyGroupsVisibility(): void {
    this.showAllGroups = !this.showAllGroups;
  }

  goToUpdateGroup(groupId: number): void {
    this.router.navigate([`/groups/update-group/${groupId}`]);

    // Close the modal after update
    this.closeModal();
  }

  deleteStudyGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this study group?')) {
      this.studyGroupService.deleteStudyGroup(groupId).subscribe({
        next: () => {
          this.toastr.success('Study group deleted successfully!');
          this.studyGroups = this.studyGroups.filter(group => group.id !== groupId);
          
          // Close the modal after deletion
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Failed to delete study group');
          console.error(err);
        }
      });
    }
  }

  get filteredGroups(): StudyGroup[] {
    return this.studyGroups.filter(group =>
      group.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectGroup(group: StudyGroup): void {
    this.selectedGroup = group;
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  openGroupDetails(group: StudyGroup): void {
    if (group && group.id !== undefined) {
      this.selectedDetailGroup = group; // Set the selected group
      const modalEl = document.getElementById('groupDetailsModal');
      if (modalEl) {
        // Initialize the modal if it hasn't been done yet
        this.modal = new bootstrap.Modal(modalEl);
        this.modal.show(); // Show the modal
      }
    } else {
      this.toastr.error('Invalid group selected');
    }
  }

  // Helper method to close the modal
  closeModal(): void {
    if (this.modal) {
      this.modal.hide(); // Close the modal using the reference
    } else {
      const modalEl = document.getElementById('groupDetailsModal');
      if (modalEl) {
        this.modal = new bootstrap.Modal(modalEl);
        this.modal.hide(); // Close the modal if it's not initialized
      }
    }
  }
}
