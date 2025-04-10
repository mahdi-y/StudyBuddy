import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ProgressService } from 'src/app/progress.service'; // Import progress service
import { Task } from 'src/app/task/task.model';
import { Progress } from 'src/app/progress/progress.model';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  tasks: Task[] = [];
  progressList: Progress[] = [];

  constructor(private taskService: TaskService, private progressService: ProgressService) { }

  ngOnInit(): void {
    this.loadProgress();  // Load progress
  }

  loadProgress(): void {
    this.progressService.getAllProgress().subscribe((progressList: Progress[]) => {
      this.progressList = progressList;
      this.loadTasksForProgress();  // Load tasks for each progress after progress data is loaded
    });
  }

  loadTasksForProgress(): void {
    this.progressList.forEach(progress => {
      this.progressService.getTasksByProgressId(progress.id).subscribe((tasks: Task[]) => {
        progress.tasks = tasks;  // Type-safe assignment, no need for 'any' or type assertion
      });
    });
  }

}
