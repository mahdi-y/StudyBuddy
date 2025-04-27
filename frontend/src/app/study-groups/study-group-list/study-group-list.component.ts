import {StudyGroupService} from '../../services/study-group.service';
import {InvitationService} from '../../services/invitation.service';
import {Router} from '@angular/router';
import {StudyGroup} from '../../models/study-group.model';
import {Invitation, SendInvitation} from '../../models/invitation.model';
import {ToastrService} from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ChatService} from "../../services/chat.service"; // Adjust path accordingly
import {firstValueFrom} from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';




@Component({
  selector: 'app-study-group-list',
  templateUrl: './study-group-list.component.html',
  styleUrls: ['./study-group-list.component.scss']
})
export class StudyGroupListComponent implements OnInit {
  @ViewChild('createGroupModalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;

  studyGroups: StudyGroup[] = [];
  selectedGroup: any | null = null;
  selectedDetailGroup: StudyGroup | null = null;
  searchTerm: string = '';
  isSidebarCollapsed: boolean = false;
  showProfileDropdown: boolean = false;
  showAllGroups: boolean = false;
  currentUserId!: number;
  selectedInviteeUserId = 9;
  chatId: number | null = null;
  loadingChatId: boolean = false;
  invitees: Invitation[] = [];



  modal: bootstrap.Modal | null = null;
  user: { username: string; role: string } | null;

  constructor(
    private studyGroupService: StudyGroupService,
    private invitationService: InvitationService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserId = currentUser.id;

      // Fetch the user's study groups
      this.studyGroupService.getUserGroups(this.currentUserId).subscribe({
        next: (data) => {
          this.studyGroups = data;

          // Ensure at least one group is available before selecting the first one
          if (this.studyGroups.length > 0) {
            this.selectedGroup = this.studyGroups[0]; // Select the first study group by default

            // Load invitees for the selected study group
            if (this.selectedGroup && this.selectedGroup.id) {
              this.loadInvitees(this.selectedGroup.id);
            }

            // Load the chat ID for the selected study group
            this.loadChatIdForSelectedGroup();
          }
        },
        error: (err) => {
          console.error('Failed to load study groups:', err);
        }
      });
    }
  }

  loadInvitees(studyGroupId: number): void {
    this.studyGroupService.getInviteesByStudyGroupId(studyGroupId).subscribe({
      next: async (invitees) => {
        console.log('Invitees loaded:', invitees);

        // Fetch usernames for each invitee
        for (const invitee of invitees) {
          try {
            const user = await firstValueFrom(this.userService.getUserById(invitee.inviteeUserId));
            invitee.username = user?.username || 'Unknown'; // Add username to the invitee object
          } catch (err) {
            console.error(`Failed to fetch user for inviteeUserId ${invitee.inviteeUserId}`, err);
            invitee.username = 'Unknown'; // Default value if user fetch fails
          }
        }

        this.invitees = invitees; // Update the invitees array
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        console.error('Failed to load invitees:', err);
      }
    });
  }

  async loadChatIdForSelectedGroup(): Promise<void> {
    if (this.selectedGroup?.id) {
      this.loadingChatId = true;
      try {
        this.chatId = await firstValueFrom(this.chatService.getChatIdByStudyGroupId(this.selectedGroup.id));
        console.log('Fetched chatId:', this.chatId);
      } catch (error) {
        console.error('Failed to fetch chat ID:', error);
      } finally {
        this.loadingChatId = false;
      }
    }
  }

  loadStudyGroups(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.studyGroupService.getUserGroups(currentUser.id).subscribe({
        next: (data) => {
          this.studyGroups = data;
          if (this.studyGroups.length > 0) {
            this.selectedGroup = this.studyGroups[0]; // Select the first group by default
            this.loadInvitees(this.selectedGroup.id); // Load invitees for the selected group
          }
        },
        error: (err) => {
          console.error('Failed to load study groups:', err);
        }
      });
    }
  }

  get safeGroupId(): number | null {
    return this.selectedGroup?.id ?? null;
  }

  sendInvitation(groupId: number): void {
    const invitation: SendInvitation = {
      studyGroup: { id: groupId },
      inviterUserId: this.currentUserId,
      inviteeUserId: this.selectedInviteeUserId
    };

    const groupName = this.selectedGroup?.name || 'Unnamed Group';

    this.invitationService.sendInvitation(invitation).subscribe({
      next: (response) => {
        console.log('Invitation sent to group ID:', groupId, response);
        this.toastr.success('Invitation sent successfully!');

        this.invitationService.sendEmail(groupName).subscribe({
          next: (emailResponse) => {
            console.log('Email sent successfully:', emailResponse);
            this.toastr.success('Email notification sent!');
          },
          error: (emailError) => {
            console.error('Error sending email:', emailError);
            this.toastr.error('Failed to send email notification');
          }
        });
      },
      error: (error) => {
        console.error('Error sending invitation:', error);
        this.toastr.error('Failed to send invitation');
      }
    });
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
    // Set the selected group
    this.selectedGroup = group;

    // Load invitees for the selected study group
    if (this.selectedGroup && this.selectedGroup.id) {
      this.loadInvitees(this.selectedGroup.id);
    }

    // Load the chat ID for the selected study group
    this.loadChatIdForSelectedGroup();
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
