import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudyGroupService } from 'src/app/services/study-group.service';
import { StudyGroup } from 'src/app/models/study-group.model';

@Component({
  selector: 'app-study-group-update',
  templateUrl: './study-group-update.component.html',
  styleUrls: ['./study-group-update.component.css']
})
export class StudyGroupUpdateComponent implements OnInit {
  groupId!: number;
  studyGroup: StudyGroup = {} as StudyGroup;
  originalGroup: StudyGroup = {} as StudyGroup; // Store original values for change detection

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studyGroupService: StudyGroupService
  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch the group by ID and store original values
    this.studyGroupService.getGroupById(this.groupId).subscribe({
      next: (group: StudyGroup) => {
        this.studyGroup = { ...group }; // Copy the data to studyGroup
        this.originalGroup = { ...group }; // Store original values for comparison
      },
      error: (err: any) => {
        console.error('Error fetching group:', err);
      }
    });
  }

  hasChanges(): boolean {
    // Make sure both original and current data are loaded
    if (!this.originalGroup || !this.studyGroup) return false;
  
    return this.studyGroup.name !== this.originalGroup.name ||
           this.studyGroup.description !== this.originalGroup.description;
  }
  

  updateGroup(): void {
    // Validate fields
    if (this.studyGroup.name.trim() === '' || this.studyGroup.description.trim() === '') {
      console.log('Both group name and description are required.');
      return; // Prevent update if fields are empty
    }

    // Prevent update if no changes have been made
    if (this.studyGroup.name === this.originalGroup.name && this.studyGroup.description === this.originalGroup.description) {
      console.log('No changes detected.');
      return; // Prevent update if no changes
    }

    // Proceed with the update
    this.studyGroupService.updateGroup(this.groupId, this.studyGroup).subscribe({
      next: () => {
        console.log('Group updated successfully');
        this.router.navigate(['/study-groups']);
      },
      error: (err: any) => {
        console.error('Error during update:', err);
      }
    });
  }
}
