import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import {firstValueFrom, Subscription} from 'rxjs';
import { saveAs } from 'file-saver';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-reported-messages',
  templateUrl: './reported-messages.component.html',
  styleUrls: ['./reported-messages.component.css']
})
export class ReportedMessagesComponent implements OnInit, OnDestroy {
  reportedMessages: any[] = []; // Holds all reported messages
  filteredMessages: any[] = []; // Holds filtered messages
  selectedReason: string = 'All';// Stores the selected reason for filtering
  private reportsSubscription: Subscription | null = null;
  reportToDismiss: any = null;
  isLoading = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | null = null;
  allReasons: string[] = [
    'Harassment',
    'Spam',
    'Hate Speech',
    'Offensive Language',
    'Inappropriate Content',
    'Other'
  ];
  user: { username: string; role: string } | null;
  usernameMap: Map<number, string> = new Map();

  constructor(private authService: AuthService, private chatService: ChatService) {
    this.user = this.authService.getCurrentUser();
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    try {
      const reports = await firstValueFrom(this.chatService.getReportedMessages());
      console.log('Fetched reported messages:', reports);
      this.reportedMessages = reports;
      this.filteredMessages = reports;

      // Fetch usernames for all unique sender and reporter IDs
      await this.fetchUsernames(reports);

      this.isLoading = false;
    } catch (error) {
      console.error('Failed to fetch reported messages:', error);
      this.isLoading = false;
      this.showToast('Failed to load reported messages.', 'error');
    }

    this.reportsSubscription = this.chatService.subscribeToReports().subscribe({
      next: async (updatedReports: any) => {
        if (Array.isArray(updatedReports)) {
          this.reportedMessages = updatedReports;
          await this.fetchUsernames(updatedReports);
        } else {
          this.reportedMessages.push(updatedReports);
          await this.fetchUsernames([updatedReports]);
        }
        this.filterReports();
      },
      error: (error: any) => {
        console.error('Error subscribing to reports:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.reportsSubscription?.unsubscribe();
  }

  // Filter messages by selected reason
  filterReports(): void {
    if (this.selectedReason === 'All' || !this.selectedReason) {
      this.filteredMessages = this.reportedMessages;
    } else {
      this.filteredMessages = this.reportedMessages.filter(
        report => report.reason === this.selectedReason
      );
    }
  }

  // Delete the message and remove the report
  deleteMessage(report: any): void {
    const messageId = report.message?.id;
    const chatId = report.message?.chat?.id;

    if (!messageId || !chatId) {
      console.error('Cannot delete message - messageId or chatId is undefined');
      this.showToast('Error: Message or chat information is missing.', 'error');
      return;
    }

    this.chatService.deleteMessage(messageId, chatId)
      .then(() => {
        this.reportedMessages = this.reportedMessages.filter(r => r.id !== report.id);
        this.showToast('Message deleted successfully.', 'success');
        setTimeout(() => this.reportToDismiss = null, 1000);
      })
      .catch(err => {
        console.error('Failed to delete message:', err);
        this.showToast('Failed to delete message.', 'error');
      });
  }

  // Open confirmation to dismiss the report
  openDismissConfirm(report: any): void {
    this.reportToDismiss = report;
  }

  // Cancel the dismiss confirmation
  cancelDismiss(): void {
    this.reportToDismiss = null;
  }

  // Confirm dismissal and remove the report
  // Confirm dismissal and remove the report
  confirmDismiss(): void {
    if (!this.reportToDismiss?.id) {
      console.error('Cannot dismiss report - reportId is undefined');
      this.showToast('Error: Report ID is missing.', 'error');
      return;
    }

    this.chatService.dismissReport(this.reportToDismiss.id)
      .then(() => {
        this.reportedMessages = this.reportedMessages.filter(r => r.id !== this.reportToDismiss.id);
        this.reportToDismiss = null;
        this.showToast('Report dismissed successfully.', 'success');
        // Reload the page after dismissal
        window.location.reload();
      })
      .catch(err => {
        console.error('Failed to dismiss report:', err);
        this.showToast('Failed to dismiss report.', 'error');
      });
  }


  // Show toast messages for feedback
  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      const toast = document.querySelector('.toast');
      if (toast) toast.classList.add('fade-out');
    }, 2500);

    setTimeout(() => {
      this.toastMessage = null;
      this.toastType = null;
    }, 3000);
  }

  exportToCSV(): void {
    const headers = ['Report ID', 'Message Content', 'Sender ID', 'Reporter ID', 'Reason', 'Timestamp'];
    const csvRows = [headers.join(',')];

    this.filteredMessages.forEach(report => {
      const row = [
        report.id,
        `"${(report.message?.content || '').replace(/"/g, '""')}"`,
        report.message?.senderId || '',
        report.reporterId || '',
        report.reason || '',
        new Date(report.timestamp).toLocaleString() || ''
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `reported-messages-${new Date().toISOString().split('T')[0]}.csv`;

    saveAs(blob, filename);
  }

  private async fetchUsernames(reports: any[]): Promise<void> {
    const uniqueUserIds = new Set<number>();

    // Collect all unique user IDs (senders and reporters)
    reports.forEach(report => {
      if (report.message?.senderId) uniqueUserIds.add(report.message.senderId);
      if (report.reporterId) uniqueUserIds.add(report.reporterId);
    });

    // Fetch usernames for each unique ID
    for (const userId of uniqueUserIds) {
      if (!this.usernameMap.has(userId)) {
        try {
          const user = await firstValueFrom(this.chatService.getUserById(userId));
          this.usernameMap.set(userId, user?.username || `User ${userId}`);
        } catch (err) {
          console.error(`Failed to fetch user for ID ${userId}`, err);
          this.usernameMap.set(userId, `User ${userId}`);
        }
      }
    }
  }

  getUsername(userId: number): string {
    return this.usernameMap.get(userId) || `User ${userId}`;
  }
}
