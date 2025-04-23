import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ressource } from '../models/resource.model';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private apiUrl = 'http://localhost:8081/api/ressources';  // Replace this with your correct backend API URL

  constructor(private http: HttpClient) {}

  // Define the getResources method that uses the apiUrl property
  getResources(): Observable<Ressource[]> {
    return this.http.get<Ressource[]>(this.apiUrl).pipe(
      tap(data => console.log('Resources fetched from API:', data))  // Add this
    );
  }

   // Add a new resource
   addResource(resource: Ressource): Observable<Ressource> {
    return this.http.post<Ressource>(this.apiUrl, resource);
  }
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:8081/api/upload', formData);
  }


  // Update an existing resource
  updateResource(resource: Ressource): Observable<Ressource> {
    return this.http.put<Ressource>(`${this.apiUrl}/${resource.idResource}`, resource);
  }

  // Delete a resource
  deleteResource(resourceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${resourceId}`);
  }
}

