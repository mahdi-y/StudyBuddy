import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from './task.model';
import {Progress} from "../progress/progress.model";
import {ProgressService} from "../progress.service";
import {forkJoin} from "rxjs";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnChanges {
  tasks: Task[] = [];
  //today: string = '';
  @Input() studyGroupId: number | undefined;
  isLoading: boolean = false;
  progresses: Progress[] = [];
  @Input() progressId: number | undefined;
  showProgressModal: boolean = false;
  showTaskModal: boolean = false;
  showUpdateModal: boolean = false;
  selectedTaskForUpdate: any = null;
  showDeleteConfirmation: boolean = false;
  taskToDelete: number | null = null;
  @Input() invitees: any[] = [];
  filteredTasks: Task[] = [];

  currentUserId: number | undefined;

  constructor(private taskService: TaskService, private router: Router, private cdr: ChangeDetectorRef, private progressService: ProgressService,
  private authService: AuthService) {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id;
  }

  ngOnInit(): void {
    // Fetch all tasks (if needed)

    // Load progresses if studyGroupId is provided
    if (this.studyGroupId) {
      console.log('Study Group ID detected:', this.studyGroupId);
      this.loadProgressesForGroup(this.studyGroupId);
    } else {
      console.log('No study group detected!');
    }

    // Load tasks if progressId is provided
    if (this.progressId) {
      console.log('Progress ID detected:', this.progressId);
      this.loadTasksForProgress(this.progressId);
    } else {
      console.log('No progress detected!');
    }
  }

  filterTasksForCurrentUser(): void {
    if (this.currentUserId) {
      this.filteredTasks = this.tasks.filter(task => task.assignedTo === this.currentUserId);
    } else {
      this.filteredTasks = []; // No tasks if no current user is detected
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['studyGroupId'] && this.studyGroupId) {
      console.log('Study Group ID detected:', this.studyGroupId);

      // Clear existing data before loading new progresses
      this.progresses = [];
      this.filteredTasks = [];
      this.loadProgressesForGroup(this.studyGroupId);
    }

    if (changes['progressId'] && this.progressId) {
      console.log('Progress ID detected:', this.progressId);

      // Clear existing tasks before loading new tasks
      this.tasks = [];
      this.loadTasksForProgress(this.progressId);
    }
  }

  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filterTasksForCurrentUser(); // Filter tasks after loading
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log('✅ Task deleted successfully');
        // Remove the task from the local tasks array
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: (err) => {
        console.error('❌ Error deleting task:', err);
      }
    });
  }

  editTask(id: number): void {
    this.router.navigate([`/task/update/${id}`]);
  }

  loadProgressesForGroup(groupId: number): void {
    console.log('Loading progresses for study group:', groupId);

    this.progressService.getProgressesByStudyGroup(groupId).subscribe({
      next: (progresses) => {
        this.progresses = progresses;
        console.log('Progresses loaded:', this.progresses);

        // Clear existing tasks before loading new tasks
        this.tasks = [];

        // Load tasks for all progresses
        if (this.progresses.length > 0) {
          this.loadTasksForAllProgresses();
        } else {
          console.log('No progresses available for this study group.');
        }
      },
      error: (err) => {
        console.error('Failed to load progresses', err);
      }
    });
  }

  loadTasksForAllProgresses(): void {
    this.isLoading = true;
    const taskObservables = this.progresses.map(progress =>
      this.taskService.getTasksByProgressId(progress.id)
    );
    forkJoin(taskObservables).subscribe({
      next: (allTasksArrays) => {
        this.tasks = allTasksArrays.flat();
        this.filterTasksForCurrentUser(); // Filter tasks after loading
        this.isLoading = false;

        // Check if there are no tasks for the current user
        if (this.filteredTasks.length === 0) {
          console.log('No tasks available for the current user.');
        }
      },
      error: (err) => {
        console.error('Failed to load tasks for one or more progresses:', err);
        this.isLoading = false;
      }
    });
  }

  loadTasksForProgress(progressId: number): void {
    this.isLoading = true;
    this.taskService.getTasksByProgressId(progressId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filterTasksForCurrentUser(); // Filter tasks after loading
        this.isLoading = false;

        // Check if there are no tasks for the current user
        if (this.filteredTasks.length === 0) {
          console.log('No tasks available for the current user.');
        }
      },
      error: (err) => {
        console.error('Failed to load tasks for progress ID:', progressId, err);
        this.isLoading = false;
      }
    });
  }

  openProgressModal(): void {
    this.showProgressModal = true; // Show the modal
  }

  closeProgressModal(): void {
    this.showProgressModal = false; // Hide the modal
  }

  openTaskModal(): void {
    this.showTaskModal = true; // Show the task modal
  }

  closeTaskModal(): void {
    this.showTaskModal = false; // Hide the task modal
  }

  openUpdateModal(task: any): void {
    console.log('Opening update modal with task:', task);
    this.selectedTaskForUpdate = { ...task };
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false; // Hide the modal
    this.selectedTaskForUpdate = null; // Reset the selected task
  }

  onTaskUpdated(): void {
    console.log('Task updated successfully');

    // Close the modal
    this.closeUpdateModal();

    // Optionally refresh the tasks list if not handled via WebSocket or other mechanisms
  }

  onTaskAdded(): void {
    console.log('Task added. Reloading tasks...');

    if (this.progressId) {
      // Reload tasks for the specific progress
      this.loadTasksForProgress(this.progressId);
    } else if (this.studyGroupId) {
      // Reload tasks for all progresses in the study group
      this.loadTasksForAllProgresses();
    } else {
      // Fallback: Reload all tasks
      this.getAllTasks();
    }
  }

  openDeleteConfirmation(taskId: number): void {
    this.taskToDelete = taskId; // Store the ID of the task to be deleted
    this.showDeleteConfirmation = true; // Show the modal
  }

// Confirm the deletion
  confirmDelete(): void {
    if (this.taskToDelete !== null) {
      this.deleteTask(this.taskToDelete); // Call the deleteTask method
      this.taskToDelete = null; // Reset the taskToDelete variable
      this.showDeleteConfirmation = false; // Hide the modal
    }
  }

// Cancel the deletion
  cancelDelete(): void {
    this.taskToDelete = null; // Reset the taskToDelete variable
    this.showDeleteConfirmation = false; // Hide the modal
  }



}
