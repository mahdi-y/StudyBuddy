import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudyGroupService {

  private apiUrl = 'http://localhost:9099/api/study-groups';

  constructor(private http: HttpClient) {}

  getUserStudyGroups(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getChatIdByStudyGroupId(studyGroupId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${studyGroupId}/chat`);
  }
}
