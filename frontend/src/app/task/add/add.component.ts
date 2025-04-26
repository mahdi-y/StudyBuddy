import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../task.model';
import { ProgressService } from '../../progress.service';
import { Progress } from '../../progress/progress.model';
import {map} from "rxjs";
import { ActivatedRoute } from '@angular/router';

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
  @Output() taskAdded = new EventEmitter<void>()

  constructor(
    private taskService: TaskService,
    private progressService: ProgressService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if studyGroupId is already provided as an @Input()
    if (this.studyGroupId !== undefined) {
      console.log('Study Group ID (from Input):', this.studyGroupId);
    } else {
      // Fallback to query parameters if @Input() is not provided
      this.route.queryParams.subscribe(params => {
        const id = params['studyGroupId'];
        if (id && !isNaN(+id)) {
          this.studyGroupId = +id; // Convert to number only if valid
          console.log('Study Group ID (from Query Params):', this.studyGroupId);
        } else {
          console.warn('No valid studyGroupId found in query parameters.');
          this.studyGroupId = undefined; // Explicitly set to undefined if invalid
        }
      });
    }

    // Rest of your existing ngOnInit code...
    this.loadProgressList();
    const todayDate = new Date();
    this.createdAt = todayDate.toISOString().split('T')[0];
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

  addTask(): void {
    const taskData = {
      title: this.newTask.title,
      description: this.newTask.description,
      dueDate: this.formatDueDate(this.newTask.dueDate),
      completed: this.newTask.completed,
      progressId: this.newTask.progressId,
      progressName: this.newProgressName.trim() || undefined,
      studyGroupId: this.studyGroupId
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
