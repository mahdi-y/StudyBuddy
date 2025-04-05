import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../task.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddTaskComponent {
  newTask: Task = {
    title: '',
    description: '',
    dueDate: '',
    progressId: null,
    completed: false,
    // Don't send id or createdAt if backend auto-generates them
  } as Task;

  constructor(private taskService: TaskService, private router: Router) {}


  addTask(): void {
    const taskToSend: Partial<Task> = {
      title: this.newTask.title,
      description: this.newTask.description,
      dueDate: this.formatDueDate(this.newTask.dueDate), // Format the dueDate before sending
      completed: this.newTask.completed,
      progressId: this.newTask.progressId ? Number(this.newTask.progressId) : null
    };

    console.log('🚀 Sending task:', taskToSend);
    console.log('Formatted dueDate:', taskToSend.dueDate); // Log formatted dueDate

    this.taskService.createTask(taskToSend).subscribe({
      next: () => {
        console.log('✅ Task successfully added');
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.error('❌ Error adding task:', err);
      }
    });
  }


// Format the dueDate as ISO-8601 string (yyyy-MM-dd'T'HH:mm:ss)
  private formatDueDate(date: string): string {
    const formattedDate = new Date(date).toISOString(); // Converts date to ISO format
    return formattedDate;
  }

}



