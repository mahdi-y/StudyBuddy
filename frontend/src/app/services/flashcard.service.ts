import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flashcard } from '../models/flashcard.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private baseUrl = 'http://localhost:8081/api/flashcards';

  constructor(private http: HttpClient) {}

  getByGroup(groupId: number): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${this.baseUrl}/group/${groupId}`);
  }

  generate(groupId: number): Observable<Flashcard[]> {
    return this.http.post<Flashcard[]>(`${this.baseUrl}/generate/${groupId}`, {});
  }
}
