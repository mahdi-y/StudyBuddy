import { Component, OnInit } from '@angular/core';
import { StudyGroupService } from '../../services/study-group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { StudyGroup, CreateStudyGroup } from '../../models/study-group.model';

@Component({
  selector: 'app-study-group-create',
  templateUrl: './study-group-create.component.html',
  styleUrls: ['./study-group-create.component.css']
})
export class StudyGroupCreateComponent implements OnInit {
  groupData: CreateStudyGroup = {
    name: '',
    description: '',
    ownerUserId: 1 // Replace with actual user ID dynamically
  };
  groupId: number | null = null; // To store the groupId if editing an existing group
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private studyGroupService: StudyGroupService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.groupId = Number(id);
        if (this.groupId) {
          this.getGroupById(this.groupId); 
        }
      }
    });
  }

  createGroup(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      this.studyGroupService.createGroup(this.groupData).subscribe({
        next: (response) => {
          console.log('Group created successfully', response);
          this.successMessage = 'Study group created successfully!';
          this.errorMessage = ''; // Clear any previous errors
          this.router.navigate(['/groups']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating group', error);
          this.errorMessage = error.error?.message || 'An error occurred while creating the group';
          this.successMessage = ''; // Clear any previous success messages
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }

  private getGroupById(groupId: number): void {
    this.studyGroupService.getGroupById(groupId).subscribe({
      next: (group) => {
        // Populate group data for editing
        this.groupData = { ...group }; // Ensure the group has the necessary properties
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching group', error);
        this.errorMessage = 'An error occurred while fetching the group data.';
      }
    });
  }

  private isFormValid(): boolean {
    return this.groupData.name.trim() !== '' && this.groupData.description.trim() !== '';
  }
}
