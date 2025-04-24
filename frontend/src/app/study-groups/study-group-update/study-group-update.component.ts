import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudyGroupService } from 'src/app/services/study-group.service';
import { StudyGroup } from 'src/app/models/study-group.model';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-study-group-update',
  templateUrl: './study-group-update.component.html',
  styleUrls: ['./study-group-update.component.css']
})
export class StudyGroupUpdateComponent implements OnInit {
  groupId!: number;
  studyGroup: StudyGroup = {} as StudyGroup;
  originalGroup: StudyGroup = {} as StudyGroup;

  errorMessage: string = ''; // 👈 for displaying user-facing messages
  user: { username: string; role: string } | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studyGroupService: StudyGroupService,
    private authService: AuthService,
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));

    this.studyGroupService.getGroupById(this.groupId).subscribe({
      next: (group: StudyGroup) => {
        this.studyGroup = { ...group };
        this.originalGroup = { ...group };
      },
      error: (err: any) => {
        console.error('Error fetching group:', err);
      }
    });
  }

  hasChanges(): boolean {
    if (!this.originalGroup || !this.studyGroup) return false;

    return this.studyGroup.name !== this.originalGroup.name ||
           this.studyGroup.description !== this.originalGroup.description;
  }

  updateGroup(): void {
    this.errorMessage = ''; // Reset error message

    // Check required fields
    if (this.studyGroup.name.trim() === '' || this.studyGroup.description.trim() === '') {
      this.errorMessage = 'Both group name and description are required.';
      return;
    }

    // Check for actual changes
    if (!this.hasChanges()) {
      this.errorMessage = 'No changes detected. Please modify the form before updating.';
      return;
    }

    // Proceed with update
    this.studyGroupService.updateGroup(this.groupId, this.studyGroup).subscribe({
      next: () => {
        console.log('Group updated successfully');
        this.router.navigate(['/study-group']);
      },
      error: (err: any) => {
        console.error('Error during update:', err);
        this.errorMessage = 'An error occurred while updating the group.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
