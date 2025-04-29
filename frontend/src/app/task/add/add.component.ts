import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../task.model';
import { ProgressService } from '../../progress.service';
import { Progress } from '../../progress/progress.model';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StudyGroupService} from "../../services/study-group.service";

@Component({
  selector: 'app-add-task',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddTaskComponent implements OnInit {
  newTask: Task = {
    title: '',
    description: '',
    dueDate: '',
    progressId: null,
    completed: false
  } as Task;

  progressList: Progress[] = [];
  newProgressName: string = '';
  createdAt: string = '';
  @Input() studyGroupId!: number | undefined;
  @Output() taskAdded = new EventEmitter<void>();
  @Input() invitees: any[] = [];

  usersInStudyGroup: any[] = []; // Array to store users in the study group
  selectedAssignedTo: number | null = null; // ID of the user selected for assignment

  constructor(
    private taskService: TaskService,
    private progressService: ProgressService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Check if studyGroupId is already provided as an @Input()
    if (this.studyGroupId !== undefined) {
      console.log('Study Group ID (from Input):', this.studyGroupId);
      this.loadProgressListForStudyGroup(this.studyGroupId);
    } else {
      // Fallback to query parameters if @Input() is not provided
      this.route.queryParams.subscribe(params => {
        const id = params['studyGroupId'];
        if (id && !isNaN(+id)) {
          this.studyGroupId = +id; // Convert to number only if valid
          console.log('Study Group ID (from Query Params):', this.studyGroupId);
          this.loadProgressListForStudyGroup(this.studyGroupId);
        } else {
          console.warn('No valid studyGroupId found in query parameters.');
          this.loadProgressList(); // Load all progresses as fallback
        }
      });
    }

    const todayDate = new Date();
    this.createdAt = todayDate.toISOString().split('T')[0];
  }

  loadProgressList(): void {
    this.progressService.getAllProgress().subscribe({
      next: (progressList) => {
        console.log('📦 All progress list received:', progressList);
        this.progressList = progressList.filter(p => !p.archived);
      },
      error: (err) => {
        console.error('❌ Error fetching progress list', err);
      }
    });
  }

  loadProgressListForStudyGroup(studyGroupId: number): void {
    this.progressService.getProgressesByStudyGroup(studyGroupId).subscribe({
      next: (progresses) => {
        console.log('📦 Progress list for study group received:', progresses);
        this.progressList = progresses.filter(p => !p.archived);
      },
      error: (err) => {
        console.error('❌ Error fetching progress list for study group', err);
      }
    });
  }

  addTask(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('User not logged in');
      alert('You must be logged in to create a task.');
      return;
    }

    const taskData = {
      title: this.newTask.title,
      description: this.newTask.description,
      dueDate: this.formatDueDate(this.newTask.dueDate),
      completed: this.newTask.completed,
      progressId: this.newTask.progressId,
      progressName: this.newProgressName.trim() || undefined,
      studyGroupId: this.studyGroupId,
      createdBy: currentUser.id, // Include the current user's ID
      assignedTo: this.selectedAssignedTo // Optional: You can add logic to assign tasks here
    };

    this.taskService.createTask(taskData).subscribe({
      next: () => {
        console.log('Task added successfully');

        // Emit the taskAdded event to notify the parent
        this.taskAdded.emit();

        // Reset form fields
        this.newTask = {
          id: 0,
          title: '',
          description: '',
          dueDate: '',
          completed: false,
          progressId: null
        };
        this.newProgressName = '';
      },
      error: (err) => {
        console.error('Error adding task:', err);
        alert('Failed to add task. Please try again.');
      }
    });
  }

  // Validates that at least one of the progress fields is filled
  isProgressValid() {
    return this.newTask.progressId !== null || this.newProgressName.trim() !== '';
  }

  // Validates that not both progress fields are filled at the same time
  isProgressExclusive() {
    return !(this.newTask.progressId !== null && this.newProgressName.trim() !== '');
  }

  private formatDueDate(date: string): string {
    return new Date(date).toISOString();
  }
}
