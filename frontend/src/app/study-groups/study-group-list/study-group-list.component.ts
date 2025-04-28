import { StudyGroupService } from '../../services/study-group.service';
import { InvitationService } from '../../services/invitation.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { StudyGroup } from '../../models/study-group.model';
import { SendInvitation } from '../../models/invitation.model';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
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
  showModal: boolean = false;
  newResource: any = { title: '', fileUrl: '', description: '' };
  selectedFile: File | null = null;
  studyGroups: StudyGroup[] = [];
  selectedGroup: StudyGroup | null = null;
  selectedDetailGroup: StudyGroup | null = null;
  searchTerm: string = '';
  isSidebarCollapsed: boolean = false;
  showProfileDropdown: boolean = false;
  showAllGroups: boolean = false;
  currentUserId!: number;
  selectedInviteeUserId = 4;
  resources: any[] = [];
  @Input() studyGroupId: number | undefined; // Study Group ID passed from the parent


  modal: bootstrap.Modal | null = null;
  user: { username: string; role: string } | null;

  constructor(
    private studyGroupService: StudyGroupService,
    private cdr: ChangeDetectorRef,
    private invitationService: InvitationService,
    private router: Router,
    private toastr: ToastrService,
    private ressourceService: RessourceService,
    private authService: AuthService // Add this line
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
}
