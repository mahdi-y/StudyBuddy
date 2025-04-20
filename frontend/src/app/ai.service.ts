import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private apiUrl = 'http://localhost:9098/api/ai/generate'; // adjust if needed
  constructor(private http: HttpClient) {}

  generateAIResponse(prompt: string, pageContent: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(
      this.apiUrl,
      {
        prompt,
        context: pageContent // Send page content as context
      },
      { headers, responseType: 'text' }
    );
  }
}
