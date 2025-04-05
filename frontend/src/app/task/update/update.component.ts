import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-update-task',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateTaskComponent implements OnInit {
  taskId: number | null = null;
  task: Task = {
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    createdAt: '',
    progressId: null,
    completed: false
  };

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.taskId = +id;
        this.getTask();
      }
    });
  }

  getTask(): void {
    if (this.taskId !== null) {
      this.taskService.getTask(this.taskId).subscribe(task => {
        this.task = task;
        // Ensure `dueDate` is in the right format
        this.task.dueDate = this.formatDueDate(this.task.dueDate);
      });
    }
  }

  updateTask(): void {
    if (this.taskId !== null) {
      // Ensure dueDate is properly formatted before updating
      this.task.dueDate = this.formatDueDate(this.task.dueDate);

      // Handle null progressId correctly (send null if not selected)
      const taskToUpdate: Task = {
        ...this.task,
        progressId: this.task.progressId ?? null // Ensure null if no progress is selected
      };

      // Ensure the task object has the correct structure
      console.log('🚀 Sending updated task:', taskToUpdate);

      this.taskService.updateTask(this.taskId, taskToUpdate).subscribe({
        next: () => {
          console.log('✅ Task updated successfully');
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('❌ Error updating task:', err);
        }
      });
    }
  }


  private formatDueDate(date: string): string {
    // Ensure the date is in ISO format before sending it to the backend
    const formattedDate = new Date(date);
    return formattedDate.toISOString();
  }
}
