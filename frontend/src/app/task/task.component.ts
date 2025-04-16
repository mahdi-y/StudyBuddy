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

  // checkDueDates(): void {
  //   const today = new Date();
  //
  //   this.tasks.forEach(task => {
  //     if (task.dueDate) {
  //       const due = new Date(task.dueDate);
  //
  //       // Check if the date is valid
  //       if (!isNaN(due.getTime())) {
  //         const daysLeft = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  //         if (daysLeft <= 2 && daysLeft >= 0) {
  //           alert(`🔔 Reminder: Task "${task.title}" is due ${daysLeft === 0 ? 'today' : 'in ' + daysLeft + ' day(s)'}!`);
  //         }
  //       } else {
  //         console.warn(`Invalid due date for task "${task.title}":`, task.dueDate);
  //       }
  //     }
  //   });
  // }
  //
  // getDueClass(date: string): string {
  //   const today = new Date();
  //   const due = new Date(date);
  //   const daysLeft = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  //
  //   if (daysLeft < 0) return 'text-muted'; // past due
  //   if (daysLeft === 0) return 'text-danger'; // today
  //   if (daysLeft <= 2) return 'text-warning'; // soon
  //   return 'text-success'; // far away
  // }



  editTask(id: number): void {
    this.router.navigate([`/task/update/${id}`]);
  }
}
