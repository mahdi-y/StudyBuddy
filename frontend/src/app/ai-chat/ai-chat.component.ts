import { Component } from '@angular/core';
import { AiService } from '../ai.service';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent {
  userPrompt = '';
  aiResponse = '';
  isLoading = false;

  constructor(private aiService: AiService) {}

  // Get visible text from the page
  getPageContent(): string {
    return document.body.innerText || ''; // Or use a more specific selector
  }

  generateResponse() {
    if (!this.userPrompt.trim()) return;

    this.isLoading = true;
    this.aiResponse = '';

    const pageContent = this.getPageContent(); // Capture page content

    this.aiService.generateAIResponse(this.userPrompt, pageContent).subscribe({
      next: (response) => {
        this.aiResponse = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.aiResponse = 'Error getting AI response. Try again.';
        this.isLoading = false;
      }
    });
  }
}
