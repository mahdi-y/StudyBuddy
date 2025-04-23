import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reported-messages',
  templateUrl: './reported-messages.component.html',
  styleUrls: ['./reported-messages.component.css']
})
export class ReportedMessagesComponent implements OnInit, OnDestroy {
  reportedMessages: any[] = []; // Holds all reported messages
  private reportsSubscription: Subscription | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Fetch initial reported messages from the database via HTTP
    this.chatService.getReportedMessages().subscribe({
      next: (reports: any[]) => {
        console.log('Fetched reported messages:', reports); // Log the response
        this.reportedMessages = reports;
      },
      error: (error: any) => {
        console.error('Failed to fetch reported messages:', error);
      }
    });

    this.reportsSubscription = this.chatService.subscribeToReports().subscribe({
      next: (updatedReports: any) => {
        if (Array.isArray(updatedReports)) {
          // If the update contains the full list of reports
          this.reportedMessages = updatedReports;
        } else {
          // If the update contains a single new report
          this.reportedMessages.push(updatedReports);
        }
        console.log('Updated reported messages:', this.reportedMessages);
      },
      error: (error: any) => {
        console.error('Error subscribing to reports:', error);
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from WebSocket updates to prevent memory leaks
    this.reportsSubscription?.unsubscribe();
  }

  deleteMessage(report: any): void {
    const messageId = report.message?.id; // Safely access message.id
    const chatId = report.message?.chat?.id; // Safely access message.chat.id

    if (!messageId || !chatId) {
      console.error('Cannot delete message - messageId or chatId is undefined');
      return;
    }

    this.chatService.deleteMessage(messageId, chatId)
        .then(() => {
          console.log('Message deleted successfully');
          this.reportedMessages = this.reportedMessages.filter(r => r.id !== report.id);
        })
        .catch(err => {
          console.error('Failed to delete message:', err);
        });
  }

  dismissReport(report: any): void {
    if (!report.id) {
      console.error('Cannot dismiss report - reportId is undefined');
      return;
    }

    this.chatService.dismissReport(report.id)
        .then(() => {
          console.log('Report dismissed successfully');
          // Remove the dismissed report from the UI
          this.reportedMessages = this.reportedMessages.filter(r => r.id !== report.id);
        })
        .catch(err => {
          console.error('Failed to dismiss report:', err);
        });
  }
}
