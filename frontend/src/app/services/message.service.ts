import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:9099/api/messages';

  constructor(private http: HttpClient) { }

  sendMessage(chatId: number, userId: number, content: string): Observable<any> {
    const body = { userId, content };
    return this.http.post(`${this.apiUrl}/send/${chatId}`, body);
  }

  getMessages(chatId: number, userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${chatId}/user/${userId}`);
  }
}
