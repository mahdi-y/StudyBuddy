import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, tap} from 'rxjs';
import { Task } from 'src/app/task/task.model';  // We'll define this model shortly

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:9098/api/task';
  private apiUrlP = 'http://localhost:9098/api'; // Base URL

  constructor(private http: HttpClient) {}

  // Create a task
  // task.service.ts
  createTask(task: any): Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Study-Group-ID': task.studyGroupId?.toString() || ''
    });

    // Remove studyGroupId from the body since we're sending it in headers
    const { studyGroupId, ...body } = task;

    return this.http.post<Task>(`${this.apiUrl}/add`, body, { headers });
  }

// Get all progress entries
  getAllProgress(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:9098/api/progress/all'); // 👈 Use your correct backend endpoint here
  }

  // Get all tasks
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);  // Add /tasks to the URL
  }
  // Get task by ID
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/get/${id}`);
  }

  // Update a task
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/update/${id}`, task);
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getTasksByProgressId(progressId: number): Observable<Task[]> {
    console.log('Fetching tasks for progress ID:', progressId);

    return this.http.get<Task[]>(`${this.apiUrl}/by-progress/${progressId}`).pipe(
      tap((tasks) => {
        console.log('Received tasks:', tasks);
      }),
      catchError((error) => {
        console.error('Error fetching tasks:', error);
        throw error;
      })
    );
  }

}

