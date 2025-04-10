import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyGroup, CreateStudyGroup } from '../models/study-group.model';

@Injectable({
  providedIn: 'root'
})
export class StudyGroupService {
  private apiUrl = 'http://localhost:8080/api/groups';

  constructor(private http: HttpClient) {}

  createGroup(groupData: CreateStudyGroup): Observable<StudyGroup> {
    return this.http.post<StudyGroup>(this.apiUrl, groupData);
  }

  getUserGroups(userId: number): Observable<StudyGroup[]> {
    return this.http.get<StudyGroup[]>(`${this.apiUrl}/user/${userId}`);
  }
  getStudyGroups(): Observable<StudyGroup[]> {
    return this.http.get<StudyGroup[]>(this.apiUrl);
  }
}