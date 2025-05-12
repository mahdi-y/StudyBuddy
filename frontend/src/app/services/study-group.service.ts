import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyGroup, CreateStudyGroup } from '../models/study-group.model';
import {Invitation} from "../models/invitation.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StudyGroupService {


  constructor(private http: HttpClient) {}


  // Method to create a new study group
  createGroup(groupData: CreateStudyGroup): Observable<StudyGroup> {
    return this.http.post<StudyGroup>(environment.apiUrlGroups, groupData);
  }
  deleteStudyGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrlGroups}/${groupId}`);
  }

  // Method to get all groups of a specific user
  getUserGroups(userId: number): Observable<StudyGroup[]> {
    return this.http.get<StudyGroup[]>(`${environment.apiUrlGroups}/user/${userId}`);
  }

  // Method to get all study groups
  getStudyGroups(): Observable<StudyGroup[]> {
    return this.http.get<StudyGroup[]>(environment.apiUrlGroups);
  }

// study-group.service.ts
getGroupById(id: number): Observable<StudyGroup> {
  return this.http.get<StudyGroup>(`${environment.apiUrlGroups}/${id}`);  // Corrected endpoint
}

  // Method to update an existing study group
  updateGroup(groupId: number, groupData: StudyGroup): Observable<StudyGroup> {
    return this.http.put<StudyGroup>(`${environment.apiUrlGroups}/${groupId}`, groupData);
  }
  generateDescription(groupName: string): Observable<string> {
    return this.http.get(`${environment.openAiApiUrl}/group-description`, {
      params: { groupName },
      responseType: 'text'
    });
  }

  getInviteesByStudyGroupId(studyGroupId: number): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${environment.apiUrlInvites}/study-group/${studyGroupId}`);
  }


}
