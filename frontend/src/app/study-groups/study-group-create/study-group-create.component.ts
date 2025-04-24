import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudyGroupService } from '../../services/study-group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { StudyGroup, CreateStudyGroup } from '../../models/study-group.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-study-group-create',
  templateUrl: './study-group-create.component.html',
  styleUrls: ['./study-group-create.component.css']
})
export class StudyGroupCreateComponent implements OnInit, OnDestroy {
  groupData: CreateStudyGroup = {
    name: '',
    description: '',
    ownerUserId: 1 // Replace this with the actual user ID dynamically, possibly from an auth service
  };
  groupId: number | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  private nameChanged: Subject<string> = new Subject<string>();
  private nameChangeSub?: Subscription;
  private routeParamsSub?: Subscription;

  constructor(
    private studyGroupService: StudyGroupService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters
    this.routeParamsSub = this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.groupId = Number(id);
        if (this.groupId) {
          this.getGroupById(this.groupId);
        }
      }
    });

    // Debounced name change detection
    this.nameChangeSub = this.nameChanged.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(name => {
      if (name.trim() && !this.groupData.description.trim()) {
        this.studyGroupService.generateDescription(name).subscribe({
          next: (description: string) => {
            this.groupData.description = description;
          },
          error: (err: any) => {
            console.error('Failed to generate description:', err);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.nameChangeSub?.unsubscribe();
    this.routeParamsSub?.unsubscribe();
  }

  onNameChange(name: string): void {
    this.groupData.name = name;
    this.groupData.description = '';  // Clear description for regeneration
    this.nameChanged.next(name);
  }

  createGroup(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      this.studyGroupService.createGroup(this.groupData).subscribe({
        next: () => {
          this.successMessage = 'Study group created successfully!';
          this.errorMessage = '';
          this.router.navigate(['/study-groups']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'An error occurred while creating the group';
          this.successMessage = '';
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
      next: (group: StudyGroup) => {
        this.groupData = {
          name: group.name,
          description: group.description,
          ownerUserId: group.ownerUserId
        };
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching group:', error);
        this.errorMessage = 'An error occurred while fetching the group data.';
      }
    });
  }

  private isFormValid(): boolean {
    return this.groupData.name.trim() !== '' && this.groupData.description.trim() !== '';
  }
}
