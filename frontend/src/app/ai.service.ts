import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AiService {

  constructor(private http: HttpClient) {}

  generateAIResponse(prompt: string, pageContent: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(
      environment.apiUrlAi,
      {
        prompt,
        context: pageContent // Send page content as context
      },
      { headers, responseType: 'text' }
    );
  }
}
