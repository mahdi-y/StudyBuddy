import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudyGroupService } from 'src/app/services/study-group.service';
import { StudyGroup } from 'src/app/models/study-group.model';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-study-group-update',
  templateUrl: './study-group-update.component.html',
  styleUrls: ['./study-group-update.component.css']
})
export class StudyGroupUpdateComponent implements OnInit, OnChanges {
  @Input() group: StudyGroup | null = null;

  studyGroup: StudyGroup = {} as StudyGroup;
  originalGroup: StudyGroup = {} as StudyGroup;

  errorMessage: string = '';
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
    // Nothing here anymore about group (or just optional future initialization)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['group'] && this.group) {
      // When input 'group' is received/updated
      this.studyGroup = { ...this.group };
      this.originalGroup = { ...this.group };
    }
  }

  hasChanges(): boolean {
    if (!this.originalGroup || !this.studyGroup) return false;
    return this.studyGroup.name !== this.originalGroup.name ||
           this.studyGroup.description !== this.originalGroup.description;
  }

  updateGroup(): void {
    this.errorMessage = '';

    if (!this.studyGroup.name.trim() || !this.studyGroup.description.trim()) {
      this.errorMessage = 'Both group name and description are required.';
      return;
    }

    if (!this.hasChanges()) {
      this.errorMessage = 'No changes detected. Please modify the form before updating.';
      return;
    }

    this.studyGroupService.updateGroup(this.studyGroup.id, this.studyGroup).subscribe({
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
