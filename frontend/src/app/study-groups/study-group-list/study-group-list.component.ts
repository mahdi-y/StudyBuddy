import { StudyGroupService } from '../../services/study-group.service';
import { InvitationService } from '../../services/invitation.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { StudyGroup } from '../../models/study-group.model';
import { Invitation, SendInvitation } from '../../models/invitation.model';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { ChatService } from "../../services/chat.service"; // Adjust path accordingly
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import {Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, Input, ElementRef} from '@angular/core';
import { StudyGroupCreateComponent } from '../study-group-create/study-group-create.component';
import {AuthService} from "../../services/auth.service"; // Adjust path accordingly
import {RessourceComponent} from "../../pages/ressource/ressource.component";
import {Ressource} from "../../models/resource.model";
import {RessourceService} from "../../services/ressource.service";

@Component({
  selector: 'app-study-group-list',
  templateUrl: './study-group-list.component.html',
  styleUrls: ['./study-group-list.component.scss']
})
export class StudyGroupListComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the hidden file input

  @ViewChild('createGroupModalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;
  inviteeEmailOrId: string = ''; // Add this
  errorMessage: string = ''; // Add this to hold error messages
  successMessage: string = '';
  showModal: boolean = false;
  newResource: any = { title: '', fileUrl: '', description: '' };
  selectedFile: File | null = null;
  studyGroups: StudyGroup[] = [];
  isModalOpen: boolean = false; // Controls modal visibility
  isInvitationsVisible: boolean = false; // Controls visibility of the dropdown

  selectedGroup: StudyGroup | null = null;
  selectedDetailGroup: StudyGroup | null = null;
  searchTerm: string = '';
  isSidebarCollapsed: boolean = false;
  showProfileDropdown: boolean = false;
  showAllGroups: boolean = false;
  currentUserId!: number;
  selectedInviteeUserId: number = 4; // Could be dynamic later
  chatId: number | null = null;
  loadingChatId: boolean = false;
  invitees: Invitation[] = [];
  pendingInvitations: Invitation[] = [];
  resources: any[] = [];
  @Input() studyGroupId: number | undefined; // Study Group ID passed from the parent


  modal: bootstrap.Modal | null = null;
  inviteModal: bootstrap.Modal | null = null; // ➡️ New
  user: { username: string; role: string; profilePicture?: string } | null;

  constructor(
    private studyGroupService: StudyGroupService,
    private invitationService: InvitationService,
    private router: Router,
    private toastr: ToastrService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private ressourceService: RessourceService,
    private authService: AuthService // Add this line
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadPendingInvitations();
    this.loadUserProfile();

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
    const createGroupModalEl = document.getElementById('createGroupModal');
    if (createGroupModalEl) {
      createGroupModalEl.addEventListener('hidden.bs.modal', () => {
        this.refreshStudyGroups();
      });
    }
    // Add event listener for update modal
    const updateGroupModalEl = document.getElementById('updateGroupModal');
    if (updateGroupModalEl) {
      updateGroupModalEl.addEventListener('hidden.bs.modal', () => {
        this.refreshStudyGroups();
      });
    }
    // Listen for modal close events to refresh study groups
    const inviteModalEl = document.getElementById('inviteModal');
    if (inviteModalEl) {
      inviteModalEl.addEventListener('hidden.bs.modal', () => {
        this.refreshStudyGroups();
      });
    }

    const groupDetailsModalEl = document.getElementById('groupDetailsModal');
    if (groupDetailsModalEl) {
      groupDetailsModalEl.addEventListener('hidden.bs.modal', () => {
        this.refreshStudyGroups();
      });
    }
  }
  togglePendingInvitations() {
    this.isInvitationsVisible = !this.isInvitationsVisible;
  }
  openModal() {
    this.isModalOpen = true;
  }
  loadPendingInvitations(): void {
    const currentUser = this.authService.getCurrentUser();
    
    // Debugging: Check if the currentUser is correctly fetched
    console.log('Current User:', currentUser);
    
    if (currentUser && currentUser.id) {
      console.log('Fetching invitations for User ID:', currentUser.id);
      
      this.invitationService.getPendingInvitations(currentUser.id).subscribe({
        next: (invites: Invitation[]) => {
          // Debugging: Check the invitations returned by the API
          console.log('Received Invitations:', invites);
          
          this.pendingInvitations = invites;
          this.cdr.detectChanges(); // Optional, helps in manual change detection
        },
        error: (err) => {
          console.error('Failed to load pending invitations', err);
          this.toastr.error('Could not load pending invitations');
        }
      });
    } else {
      console.warn('User not authenticated or missing ID');
    }
  }
  acceptInvitation(invitationId: number): void {
    this.invitationService.acceptInvitation(invitationId).subscribe({
      next: (updatedInvitation) => {
        this.toastr.success('Invitation accepted!');
        
        // 🔁 Refresh all required data
        this.refreshAllData(); // This includes groups, chat, tasks, resources
        this.loadPendingInvitations(); // Make sure invitations update immediately
      },
      error: (err) => {
        console.error('Failed to accept invitation', err);
        this.toastr.error('Failed to accept invitation');
      }
    });
  }
  
  rejectInvitation(invitationId: number): void {
    this.invitationService.rejectInvitation(invitationId).subscribe({
      next: () => {
        this.toastr.info('Invitation rejected');
        
        // 🔁 Refresh all required data
        this.refreshAllData();
        this.loadPendingInvitations(); // Remove declined invitation from UI
      },
      error: (err) => {
        console.error('Failed to reject invitation', err);
        this.toastr.error('Failed to reject invitation');
      }
    });
  }

  refreshAllData(): void {
    this.refreshStudyGroups(); // Refresh study groups
  
    setTimeout(() => {
      if (this.selectedGroup?.id) {
        // Refresh related data for selected group
        this.loadInvitees(this.selectedGroup.id);
        this.loadChatIdForSelectedGroup();
        this.loadResourcesForSelectedGroup();
      }
    }, 100); // Small delay to ensure selectedGroup is updated
  }
  loadResourcesForSelectedGroup(): void {
    if (!this.selectedGroup?.id) return;
  
    this.ressourceService.getResourcesByStudyGroupId(this.selectedGroup.id).subscribe({
      next: (resources) => {
        this.resources = resources;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load resources:', err);
      }
    });
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

  openInvitationModal(group: StudyGroup): void {
    this.selectedGroup = group;
    const inviteModalEl = document.getElementById('inviteModal');
    if (inviteModalEl) {
      this.inviteModal = new bootstrap.Modal(inviteModalEl); // Save the modal instance
      this.inviteModal.show();
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

  refreshStudyGroups(): void {
    if (this.currentUserId) {
      this.studyGroupService.getUserGroups(this.currentUserId).subscribe({
        next: (data) => {
          this.studyGroups = data;
          if (this.studyGroups.length > 0) {
            this.selectedGroup = this.studyGroups[0];
            this.loadInvitees(this.selectedGroup.id);
          }
          this.cdr.detectChanges(); // Force Angular to update UI
        },
        error: (err) => {
          console.error('Failed to refresh study groups:', err);
        }
      });
    }
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
    this.refreshStudyGroups(); // ➡️ Refresh the study groups when modal is closed
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
    this.refreshStudyGroups(); // ➡️ Refresh the study groups when modal is closed
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  openAddResourceModal(): void {
    this.showModal = true;
  }

  closeModalRessource(): void {
    this.showModal = false;
    this.resetNewResource();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);  // Log the file to check if it's correct
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        this.newResource.fileUrl = base64Data;
      };
      reader.readAsDataURL(file);
    }
  }

  createResource(): void {
    if (this.newResource.title && this.newResource.fileUrl && this.newResource.description && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      console.log('FormData being sent:', formData); // Log FormData

      // Send the file for OCR processing
      this.ressourceService.uploadImageForOCR(formData).subscribe({
        next: (response) => {
          console.log('OCR processing response:', response); // Log the backend response
          if (response.base64File) {
            this.newResource.fileUrl = response.base64File;
            // Save the resource with the OCR PDF
            const resourceToAdd = {
              ...this.newResource,
              category: this.selectedGroup ? { id: this.selectedGroup.id } : null,
            };

            // Pass the selectedGroup.id as the studyGroupId
            if (this.selectedGroup?.id) {
              this.saveResource(resourceToAdd, this.selectedGroup.id);
            } else {
              alert('Please select a valid study group.');
            }
          } else {
            alert('OCR processing failed: No Base64 file returned.');
          }
        },
        error: (err) => {
          console.error('Error during OCR processing:', err);
          alert('An error occurred during OCR processing.');
        }
      });
    } else {
      alert('Please fill out all fields and select a file.');
    }
  }



  saveResource(resourceToAdd: any, studyGroupId: number): void {
    // Pass both resourceToAdd and studyGroupId to addResource
    this.ressourceService.addResource(resourceToAdd, studyGroupId).subscribe({
      next: (res) => {
        console.log('Resource successfully added:', res);
        this.loadResources(); // 🔁 Refresh the list after adding
        this.closeModalRessource(); // Hide modal and reset form
      },
      error: (err) => {
        console.error('Error adding resource:', err);
        alert('An error occurred while saving the resource.');
      }
    });
  }

  resetNewResource(): void {
    this.newResource = { title: '', fileUrl: '', description: '' };
    this.selectedFile = null;
  }

  loadResources(): void {
    this.ressourceService.getResources().subscribe({
      next: (data) => {
        this.resources = data;
        console.log('Resources loaded:', this.resources);
      },
      error: (err) => {
        console.error('Error loading resources:', err);
      }
    });
  }
  onDragOver(event: DragEvent): void {
    console.log('Drag over event detected');
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDrop(event: DragEvent): void {
    console.log('Drop event detected');
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    } else {
      console.error('No files detected in drop event');
    }
  }

  handleFile(file: File): void {
    console.log('File selected:', file); // Log the file for debugging
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      this.newResource.fileUrl = base64Data;
      console.log('File loaded successfully:', this.newResource.fileUrl);

      // Trigger change detection if needed
      this.cdr.detectChanges();
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click(); // Programmatically trigger the file input dialog
  }
  private loadUserProfile(): void {
    console.log('Fetching profile for user:', this.user?.username);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const currentUser = users.find(u => u.username === this.user!.username);
        if (currentUser && this.user) {
          console.log('Fetched profile picture URL:', currentUser.profilePicture);
          this.user.profilePicture = currentUser.profilePicture;
          const img = new Image();
          img.src = this.user.profilePicture || 'assets/backoffice/images/profile.jpg';
          img.onload = () => {
            if (this.user) {
              console.log('Profile picture loaded successfully:', this.user.profilePicture);
            }
          };
          img.onerror = () => {
            if (this.user) {
              console.error('Failed to load profile picture:', this.user.profilePicture);
              this.user.profilePicture = 'assets/backoffice/images/profile.jpg';
            }
          };
        } else {
          console.warn('User not found in API response:', this.user?.username);
          if (this.user) {
            this.user.profilePicture = 'assets/backoffice/images/profile.jpg';
          }
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        if (this.user) {
          this.user.profilePicture = 'assets/backoffice/images/profile.jpg';
        }
      }
    });
  }
}
