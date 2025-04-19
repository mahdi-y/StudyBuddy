import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from './task.model';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  //today: string = '';

  constructor(private taskService: TaskService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllTasks();
    // const now = new Date();
    // this.today = now.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  }

  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      //this.checkDueDates();

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
}
