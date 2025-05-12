import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ressource } from '../models/resource.model';
import { tap } from 'rxjs';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class RessourceService {

  constructor(private http: HttpClient) {}

  // Define the getResources method that uses the apiUrl property
  getResources(): Observable<Ressource[]> {
    return this.http.get<Ressource[]>(environment.apiUrlResources).pipe(
      tap(data => console.log('Resources fetched from API:', data))  // Add this
    );
  }

   // Add a new resource
  addResource(resource: Ressource, studyGroupId: number): Observable<Ressource> {
    const headers = new HttpHeaders({
      'Study-Group-ID': studyGroupId.toString() // Convert to string explicitly
    });

    return this.http.post<Ressource>(environment.apiUrlResources, resource, { headers });
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.studyGroupApiUrl}/upload`, formData);
  }


  // Update an existing resource
  updateResource(resource: Ressource): Observable<Ressource> {
    return this.http.put<Ressource>(`${environment.apiUrlResources}/${resource.idResource}`, resource);
  }

  // Delete a resource
  deleteResource(resourceId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrlResources}/${resourceId}`);
  }
  uploadImageForOCR(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.studyGroupApiUrl}/ocr/upload-ocr`, formData);  // Updated URL
  }

  getResourcesByStudyGroupId(studyGroupId: number): Observable<Ressource[]> {
    const headers = new HttpHeaders({
      'Study-Group-ID': studyGroupId.toString() // Convert to string explicitly
    });

    return this.http.get<Ressource[]>(`${environment.apiUrlResources}/by-study-group`, { headers });
  }


}

