import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, tap} from 'rxjs';
import { Task } from 'src/app/task/task.model';
import {environment} from "../environments/environment";  // We'll define this model shortly

@Injectable({
  providedIn: 'root'
})
export class TaskService {
// Base URL

  constructor(private http: HttpClient) {}

  // Create a task
  // task.service.tsbhgddddd
  createTask(task: any): Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Study-Group-ID': task.studyGroupId?.toString() || ''
    });

    // Remove studyGroupId from the body since we're sending it in headers
    const { studyGroupId, ...body } = task;

    return this.http.post<Task>(`${environment.apiUrlTask}/add`, body, { headers });
  }

// Get all progress entries
  getAllProgress(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:9098/api/progress/all'); // 👈 Use your correct backend endpoint here
  }

  // Get all tasks
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrlTask}/tasks`);  // Add /tasks to the URL
  }
  // Get task by ID
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${environment.apiUrlTask}/get/${id}`);
  }

  // Update a task
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${environment.apiUrlTask}/update/${id}`, task);
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrlTask}/delete/${id}`);
  }

  getTasksByProgressId(progressId: number): Observable<Task[]> {
    console.log('Fetching tasks for progress ID:', progressId);

    return this.http.get<Task[]>(`${environment.apiUrlTask}/by-progress/${progressId}`).pipe(
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

