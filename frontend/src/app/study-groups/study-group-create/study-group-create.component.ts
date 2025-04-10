import { Component } from '@angular/core';
import { StudyGroupService } from '../../services/study-group.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-study-group-create',
  templateUrl: './study-group-create.component.html'
})
export class StudyGroupCreateComponent {
  // Initialize the group data with default values
  groupData = {
    name: '',
    description: '',
    ownerUserId: 1 // Replace with actual user ID dynamically
  };

  // To track form submission state (e.g., for showing loading spinner or success/error messages)
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private studyGroupService: StudyGroupService,
    private router: Router
  ) {}

  // Method for creating a study group
  createGroup(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true; // Set submitting flag to true while the request is being processed
      this.studyGroupService.createGroup(this.groupData)
        .subscribe({
          next: (response) => {
            console.log('Group created successfully', response);
            this.router.navigate(['/groups']); // Navigate to the groups list after successful creation
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error creating group', error);
            this.errorMessage = error.error?.message || 'An error occurred while creating the group';
            this.isSubmitting = false; // Reset submitting flag
          },
          complete: () => {
            this.isSubmitting = false; // Reset submitting flag when request completes (either success or error)
          }
        });
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }

  // Simple form validation (check if fields are empty)
  private isFormValid(): boolean {
    return this.groupData.name.trim() !== '' && this.groupData.description.trim() !== '';
  }
}
