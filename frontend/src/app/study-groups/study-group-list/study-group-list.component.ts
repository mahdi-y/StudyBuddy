import { StudyGroupService } from '../../services/study-group.service';
import { InvitationService } from '../../services/invitation.service';
import { Router } from '@angular/router';
import { StudyGroup } from '../../models/study-group.model';
import { SendInvitation } from '../../models/invitation.model';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { StudyGroupCreateComponent } from '../study-group-create/study-group-create.component';
import { AuthService } from "../../services/auth.service"; // Adjust path accordingly
import { UserService } from '../../services/user.service'; // Ensure this import

@Component({
  selector: 'app-study-group-list',
  templateUrl: './study-group-list.component.html',
  styleUrls: ['./study-group-list.component.scss']
})
export class StudyGroupListComponent implements OnInit {
  @ViewChild('createGroupModalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;
  inviteeEmailOrId: string = ''; // Add this
  errorMessage: string = ''; // Add this to hold error messages
  successMessage: string = '';
  studyGroups: StudyGroup[] = [];
  selectedGroup: StudyGroup | null = null;
  selectedDetailGroup: StudyGroup | null = null;
  selectedInviteGroup: StudyGroup | null = null; // ➡️ For Invitation Modal
  searchTerm: string = '';
  isSidebarCollapsed: boolean = false;
  showProfileDropdown: boolean = false;
  showAllGroups: boolean = false;
  currentUserId!: number;

  selectedInviteeUserId: number = 4; // Could be dynamic later

  modal: bootstrap.Modal | null = null;
  inviteModal: bootstrap.Modal | null = null; // ➡️ New
  user: { username: string; role: string } | null;

  constructor(
    private studyGroupService: StudyGroupService,
    private invitationService: InvitationService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService, 
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserId = currentUser.id;

      this.studyGroupService.getUserGroups(this.currentUserId).subscribe((data) => {
        this.studyGroups = data;
        if (this.studyGroups.length > 0) {
          this.selectedGroup = this.studyGroups[0];
        }
      });
    }
  }

  get safeGroupId(): number | null {
    return this.selectedGroup?.id ?? null;
  }

  openInvitationModal(group: StudyGroup): void {
    this.selectedGroup = group;
    const inviteModalEl = document.getElementById('inviteModal');
    if (inviteModalEl) {
      const modal = new bootstrap.Modal(inviteModalEl);
      modal.show();
    }
  }

  sendInvitation(): void {
    // Clear any previous messages
    this.errorMessage = '';  // Reset the error message
    this.successMessage = '';  // Reset the success message
  
    // Validate input: check if group is selected and email is provided
    if (!this.selectedGroup || !this.inviteeEmailOrId) {
      this.errorMessage = 'Please select a group and provide an invitee email.'; // Set error message
      return;
    }
  
    // Check if the provided email is valid
    const isEmail = this.isValidEmail(this.inviteeEmailOrId);
    if (!isEmail) {
      this.errorMessage = 'Please provide a valid email.'; // Set error message
      return;
    }
  
    // Check if email exists
    this.userService.checkIfEmailExists(this.inviteeEmailOrId).subscribe({
      next: (emailExists: boolean) => {
        if (!emailExists) {
          this.errorMessage = 'The email does not exist.'; // Set error message
          return;
        }
  
        // Fetch user ID based on the email if the email exists
        this.userService.getUserIdByEmail(this.inviteeEmailOrId).subscribe({
          next: (userId: number) => {
            if (userId === 0) {
              this.errorMessage = 'User not found.'; // Set error message
              return;
            }
  
            // Check if the inviter and invitee are the same
            if (userId === this.currentUserId) {
              this.errorMessage = 'You are already a member of this group.'; // Set error message
              return;
            }
  
            // Set the user ID for the invitee
            this.selectedInviteeUserId = userId;
  
            // Send the invitation email and create invitation entry in parallel
            this.sendInvitationEmail();
          },
          error: (err: any) => {
            console.error('Error fetching user ID:', err);
            this.errorMessage = 'An error occurred while fetching the user ID.'; // Set error message
          }
        });
      },
      error: (err: any) => {
        console.error('Error checking email existence:', err);
        this.errorMessage = 'An error occurred while checking the email.'; // Set error message
      }
    });
  }
  
  sendInvitationEmail(): void {
    // Validate group and invitee user ID before sending invitation
    if (!this.selectedGroup) {
      this.toastr.error('No group selected.');
      return;
    }
  
    if (!this.selectedInviteeUserId) {
      this.toastr.error('Invitee user ID is not available.');
      return;
    }
  
    // Prepare invitation object
    const inviterUserId = this.currentUserId;
    const inviteeEmail = this.inviteeEmailOrId;
    const inviteeUserId = this.selectedInviteeUserId;
  
    const invitation: SendInvitation = {
      studyGroup: { id: this.selectedGroup.id },
      inviterUserId,
      inviteeEmail,
      inviteeUserId
    };
  
    // Send the invitation email and invitation object in parallel
    this.invitationService.sendEmail(this.selectedGroup?.name || 'Unnamed Group', inviteeEmail).subscribe({
      next: (response) => {
        console.log('Email sent successfully', response);
        this.successMessage = 'Invitation sent successfully!'; // Set success message
      },
      error: (error) => {
        console.error('Error sending email:', error);
        this.toastr.error('Failed to send the invitation email.');
      }
    });
  
    // Send invitation object
    this.invitationService.sendInvitation(invitation).subscribe({
      next: (response) => {
        console.log('Invitation sent successfully', response);
        this.successMessage = 'Invitation sent successfully!'; // Set success message
        this.toastr.success('Invitation sent successfully.');
      },
      error: (error) => {
        console.error('Error sending invitation:', error);
        this.toastr.error('An error occurred while sending the invitation.');
      }
    });
  }
  
  closeInviteModal(): void {
    if (this.inviteModal) {
      this.inviteModal.hide();
    }
  }

  goToCreateGroup(): void {
    this.router.navigate(['/study-group/new']);
  }

  toggleStudyGroupsVisibility(): void {
    this.showAllGroups = !this.showAllGroups;
  }

  goToUpdateGroup(groupId: number): void {
    this.router.navigate([`/study-group/update-group/${groupId}`]);
    this.closeModal();
  }
 isValidEmail(email: string): boolean {
    // Simple email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }
  
  openFlashcardModal() {
    const modalElement = document.getElementById('flashcardModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deleteStudyGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this study group?')) {
      this.studyGroupService.deleteStudyGroup(groupId).subscribe({
        next: () => {
          this.toastr.success('Study group deleted successfully!');
          this.studyGroups = this.studyGroups.filter(group => group.id !== groupId);
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
    if (!group || group.id === undefined) {
      this.toastr.error('Invalid group selected');
      return;
    }

    // Hide modal if it's already open
    if (this.modal) {
      this.modal.hide();
    }

    // Reset the selected detail group to force re-render
    this.selectedDetailGroup = null;

    setTimeout(() => {
      this.selectedDetailGroup = group;

      const modalEl = document.getElementById('groupDetailsModal');
      if (modalEl) {
        this.modal = new bootstrap.Modal(modalEl);
        this.modal.show();
      }
    }, 0);
  }

  closeModal(): void {
    if (this.modal) {
      this.modal.hide();
    } else {
      const modalEl = document.getElementById('groupDetailsModal');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
