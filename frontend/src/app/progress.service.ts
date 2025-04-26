import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
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

  archive(id: number): Observable<any> {
    // Send a PUT request to mark the progress as archived
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/archive`, {})
      .pipe(
        // You can log the message or handle it further if needed
        tap((response) => {
          console.log(response.message); // This will log the success message from the backend
        })
      );
  }

  getUnarchivedProgress(): Observable<Progress[]> {
    return this.getAllProgress().pipe(
      map(progressList => progressList.filter(p => !p.archived))
    );
  }
  getArchivedProgresses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/archived`);
  }

  getProgressesByStudyGroup(studyGroupId: number): Observable<Progress[]> {
    const headers = new HttpHeaders({
      'Study-Group-ID': studyGroupId.toString()
    });

    return this.http.get<Progress[]>(`${this.apiUrl}/by-study-group`, { headers });
  }

}
