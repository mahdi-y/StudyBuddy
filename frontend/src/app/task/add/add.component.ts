import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../task.model';
import { ProgressService } from '../../progress.service';
import { Progress } from '../../progress/progress.model';

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

  constructor(
    private taskService: TaskService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProgressList();
    const todayDate = new Date();
    this.createdAt = todayDate.toISOString().split('T')[0];  // Format to YYYY-MM-DD

  }

  loadProgressList(): void {
    this.progressService.getAllProgress().subscribe({
      next: (data) => {
        console.log('📦 Progress list received:', data);
        this.progressList = data;
      },
      error: (err) => {
        console.error('❌ Error fetching progress list', err);
      }
    });
  }

  addTask(): void {
    const taskToSend: any = {
      title: this.newTask.title,
      description: this.newTask.description,
      dueDate: this.formatDueDate(this.newTask.dueDate),
      completed: this.newTask.completed,
      progressId: this.newTask.progressId,
    };
    this.newTask.createdAt = this.createdAt;


    // Include progressName if user entered a new one
    if (this.newProgressName.trim() !== '') {
      taskToSend.progressName = this.newProgressName.trim();
    }

    console.log('🚀 Sending task:', taskToSend);

    this.taskService.createTask(taskToSend).subscribe({
      next: () => {
        console.log('✅ Task successfully added');
        this.router.navigate(['/study-group']);
      },
      error: (err) => {
        console.error('❌ Error adding task:', err);
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
