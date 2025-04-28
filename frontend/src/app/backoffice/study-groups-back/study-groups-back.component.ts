import { Component, OnInit } from '@angular/core';
import { StudyGroupService } from '../../services/study-group.service';
import { StudyGroup } from '../../models/study-group.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-study-groups-back',
  templateUrl: './study-groups-back.component.html',
  styleUrls: ['./study-groups-back.component.scss']
})
export class StudyGroupsBackComponent implements OnInit {

  studyGroups: StudyGroup[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private studyGroupService: StudyGroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudyGroups();
  }

  loadStudyGroups(): void {
    this.isLoading = true;
    this.errorMessage = null; // Clear any previous error message

    this.studyGroupService.getStudyGroups().subscribe({
      next: (groups) => {
        this.studyGroups = groups;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load study groups. Please try again later.';
        console.error('Error loading study groups:', err);
      }
    });
  }

  goToStudyGroup(groupId: number): void {
    this.router.navigate(['/study-group', groupId]);
  }

  deleteStudyGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this study group?')) {
      this.studyGroupService.deleteStudyGroup(groupId).subscribe({
        next: () => {
          this.studyGroups = this.studyGroups.filter(group => group.id !== groupId);
        },
        error: (err) => {
          console.error('Failed to delete study group:', err);
          alert('There was an issue deleting the study group. Please try again.');
        }
      });
    }
  }
}
