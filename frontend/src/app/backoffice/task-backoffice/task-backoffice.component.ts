import { Component, OnInit } from '@angular/core';
import { TaskService, } from '../../task.service';  // Adjust path if needed
import { Task} from "../../task/task.model";

@Component({
  selector: 'app-task-backoffice',
  templateUrl: './task-backoffice.component.html',
  styleUrls: ['./task-backoffice.component.css']
})
export class TaskBackofficeComponent implements OnInit {
  tasks: Task[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load tasks';
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.tasks = this.tasks.filter(t => t.id !== id);
      });
    }
  }
}
