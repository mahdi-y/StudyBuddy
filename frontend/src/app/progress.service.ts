import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Progress } from './progress/progress.model';
import { Task } from './task/task.model';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private apiUrl = 'http://localhost:9098/api/progress'; // Adjust the URL if needed

  constructor(private http: HttpClient) {}

  // Fetch all progress entities
  getAllProgress(): Observable<Progress[]> {
    return this.http.get<Progress[]>(`${this.apiUrl}/all`); // Correcting to use /all for fetching all progress
  }

  // Fetch tasks by progress ID
  getTasksByProgressId(progressId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${progressId}/tasks`); // Using the correct endpoint to fetch tasks
  }
}
