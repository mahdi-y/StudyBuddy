import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flashcard } from '../models/flashcard.model';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {

  constructor(private http: HttpClient) {}

  getByGroup(groupId: number): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${environment.baseUrlFlashcard}/group/${groupId}`);
  }

  generate(groupId: number): Observable<Flashcard[]> {
    return this.http.post<Flashcard[]>(`${environment.baseUrlFlashcard}/generate/${groupId}`, {});
  }


}
