import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyGroup, CreateStudyGroup } from '../models/study-group.model';
import {Invitation} from "../models/invitation.model";

@Injectable({
  providedIn: 'root'
})
export class StudyGroupService {
  private apiUrl = 'http://localhost:8081/api/groups';
  private apiUrlInvites = 'http://localhost:8081/api/invitations';

  constructor(private http: HttpClient) {}


  // Method to create a new study group
  createGroup(groupData: CreateStudyGroup): Observable<StudyGroup> {
    return this.http.post<StudyGroup>(this.apiUrl, groupData);
  }
  deleteStudyGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}`);
  }

  // Method to get all groups of a specific user
  getUserGroups(userId: number): Observable<StudyGroup[]> {
    return this.http.get<StudyGroup[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Method to get all study groups
  getStudyGroups(): Observable<StudyGroup[]> {
    return this.http.get<StudyGroup[]>(this.apiUrl);
  }

// study-group.service.ts
getGroupById(id: number): Observable<StudyGroup> {
  return this.http.get<StudyGroup>(`http://localhost:8081/api/groups/${id}`);  // Corrected endpoint
}

  // Method to update an existing study group
  updateGroup(groupId: number, groupData: StudyGroup): Observable<StudyGroup> {
    return this.http.put<StudyGroup>(`${this.apiUrl}/${groupId}`, groupData);
  }
  generateDescription(groupName: string): Observable<string> {
    return this.http.get('http://localhost:8081/api/openai/group-description', {
      params: { groupName },
      responseType: 'text'
    });
  }

  getInviteesByStudyGroupId(studyGroupId: number): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.apiUrlInvites}/study-group/${studyGroupId}`);
  }


}
