import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { ProgressService } from '../../progress.service';  // Service to fetch progress names
import { Task } from '../task.model';
import {map} from "rxjs";
import {Progress} from "../../progress/progress.model";

@Component({
  selector: 'app-update-task',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateTaskComponent implements OnInit {
  taskId: number | null = null;
  @Input() task: Task = {
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    createdAt: '',
    progressId: null,  // Bind progressId here
    progressName: '',  // Bind progressName for display purposes
    completed: false
  };
  @Output() taskUpdated = new EventEmitter<void>();
  @Input() taskIdFromParent: number | null = null;

  progressList: Progress[] = [];  // Holds progress options
  today: string = new Date().toISOString().split('T')[0];


  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private progressService: ProgressService,  // Inject Progress service
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('UpdateTaskComponent initialized');

    // Check if taskId is passed via @Input()
    if (this.taskIdFromParent !== null) {
      this.taskId = this.taskIdFromParent;
      this.getTask();
    } else {
      // Otherwise, extract taskId from route parameters
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.taskId = +id;
          this.getTask();
        } else {
          console.error('No task ID found in route parameters.');
        }
      });
    }

    this.loadProgressList();
  }

  // Fetch task details
  getTask(): void {
    if (this.taskId !== null) {
      this.taskService.getTask(this.taskId).subscribe(task => {
        this.task = task;

        // Ensure dueDate is in the right format for the input field
        if (this.task.dueDate) {
          const dueDateObj = new Date(this.task.dueDate);
          this.task.dueDate = dueDateObj.toISOString().split('T')[0];  // Ensure it's in yyyy-mm-dd format
        }

        // If progressName is not in the response, fetch it based on progressId
        if (!this.task.progressName && this.task.progressId !== null) {
          // Find progressName based on progressId
          const selectedProgress = this.progressList.find(progress => progress.id === this.task.progressId);
          if (selectedProgress) {
            this.task.progressName = selectedProgress.name;
          }
        }
      });
    }
  }


  loadProgressList(): void {
    this.progressService.getAllProgress().pipe(
      map(progressList => progressList.filter(p => !p.archived))
    ).subscribe({
      next: (filteredProgress) => {
        console.log('📦 Unarchived progress list received:', filteredProgress);
        this.progressList = filteredProgress;
      },
      error: (err) => {
        console.error('❌ Error fetching progress list', err);
      }
    });
  }



  // // Fetch available progress options
  // getProgressList(): void {
  //   this.progressService.getAllProgress().pipe(
  //     map(progressList => progressList.filter(p => !p.archived))
  //   ).subscribe({
  //     next: (filteredProgress) => {
  //       console.log('📦 Unarchived progress list received:', filteredProgress);
  //       this.progressList = filteredProgress;
  //     },
  //     error: (err) => {
  //       console.error('❌ Error fetching progress list', err);
  //     }
  //   });
  // }


  // Update task
  updateTask(): void {
    console.log('Updating task with ID:', this.taskId);
    console.log('Task data being sent:', this.task);

    if (this.taskId !== null) {
      // Ensure dueDate is formatted properly before updating
      this.task.dueDate = this.formatDueDate(this.task.dueDate);

      // Find progressId based on the selected progressName
      const selectedProgress = this.progressList.find(progress => progress.name === this.task.progressName);

      const taskToUpdate: Task = {
        ...this.task,
        progressId: selectedProgress ? selectedProgress.id : null // Map progressName to progressId
      };

      console.log('🚀 Sending updated task:', taskToUpdate);

      this.taskService.updateTask(this.taskId, taskToUpdate).subscribe({
        next: () => {
          console.log('✅ Task updated successfully');
          this.taskUpdated.emit();
          this.router.navigate(['/study-group']);
        },
        error: (err) => {
          console.error('❌ Error updating task:', err);
        }
      });
    }
  }

  // Format the due date
  private formatDueDate(date: string): string {
    const formattedDate = new Date(date);
    return formattedDate.toISOString();
  }
}
