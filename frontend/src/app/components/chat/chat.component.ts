import {Component, OnInit, OnDestroy, HostListener, Input, SimpleChanges} from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import {firstValueFrom, Subscription} from 'rxjs';
import { Message } from '../../models/message';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage: string = '';
  @Input() chatId!: number;
  @Input() senderId = 123;
  loadingMessages = false;
  private messageSubscription: Subscription | null = null;
  editingContent: string = '';
  searchQuery: string = '';
  searchActive: boolean = false;
  filteredMessages: Message[] = [];
  shouldScrollToBottom = false;
  showDropdown: boolean = false;
  profanityFilterEnabled = true;
  private typingTimeout: any;
  typingUsers: Set<number> = new Set();
  showProfanityConfirm = false;
  showScrollToBottom = false;
  selectedMessageForReport: any = null;
  reportReason: string | null = null;
  messageReported: boolean = false;
  messageReportedTimeout: any;
  selectedMessageToDelete: Message | null = null;
  currentUserId!: number;
  user: { username: string; role: string } | null;
  senderUserMap: { [id: number]: string } = {};
  typingUsernames: Set<string> = new Set();



  constructor(private authService: AuthService, private chatService: ChatService) {
    {
      this.user = this.authService.getCurrentUser();
    }
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.loadInitialMessages();
    this.subscribeToNewMessages();
    this.shouldScrollToBottom = true;
    this.loadChatSettings();
    this.subscribeToTypingIndicators();
    if (currentUser) {
      this.currentUserId = currentUser.id;
      console.log("Current user :", currentUser.id)
    }
  }

  openReportOverlay(message: any): void {
    this.selectedMessageForReport = message;
  }

  closeReportOverlay(): void {
    this.selectedMessageForReport = null;
    this.reportReason = null;
  }

  setReportReason(reason: string): void {
    this.reportReason = reason;
    if (this.selectedMessageForReport) {
      this.reportMessage(this.selectedMessageForReport, this.reportReason);
      this.closeReportOverlay();
    }
  }

  reportMessage(message: any, reason: string): void {
    if (!message.id) {
      console.error('Cannot report message - messageId is undefined');
      return;
    }
    const chatId = this.chatId;
    const reporterId = this.currentUserId; // Use currentUserId here
    this.chatService.reportMessageViaWebSocket(chatId, message.id, reporterId, reason)
      .then(() => {
        console.log('Message reported successfully');
        this.showAlert();
      })
      .catch(err => {
        console.error('Failed to report message:', err);
        this.showErrorAlert('Failed to report message. Please try again.');
      });
  }

  showAlert(): void {
    this.messageReported = true;

    // Clear any existing timeout
    if (this.messageReportedTimeout) {
      clearTimeout(this.messageReportedTimeout);
    }

    // Hide after 3 seconds with fade out
    this.messageReportedTimeout = setTimeout(() => {
      this.messageReported = false;
    }, 3000);
  }

  showErrorAlert(message: string): void {
    // You can implement a separate error alert with red styling
    // Similar to showAlert but with different styling
  }

  closeAlert(): void {
    this.messageReported = false;
    if (this.messageReportedTimeout) {
      clearTimeout(this.messageReportedTimeout);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId'] && !changes['chatId'].firstChange) {
      this.messages = [];
      this.messageSubscription?.unsubscribe();
      this.loadInitialMessages();
      this.subscribeToNewMessages();
    }
  }

  ngAfterViewInit(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.addEventListener('scroll', () => {
        const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
        this.showScrollToBottom = !nearBottom;
      });
    }
  }

  loadChatSettings() {
    this.chatService.getChatSettings(this.chatId).subscribe(settings => {
      this.profanityFilterEnabled = settings.profanityFilterEnabled;
    });
  }

  toggleProfanityFilter(): void {
    const newSetting = !this.profanityFilterEnabled;

    console.log('Attempting to toggle profanity filter to:', newSetting);

    // Optimistically update UI
    this.profanityFilterEnabled = newSetting;
    this.showDropdown = false;

    // Send update to server
    this.chatService.updateChatSettings(this.chatId, { profanityFilterEnabled: newSetting }).subscribe({
      next: () => {
        console.log('Profanity filter updated successfully');
      },
      error: (err) => {
        console.error('Failed to update filter setting:', err);
        // Revert UI change if the server update fails
        this.profanityFilterEnabled = !newSetting;
        alert('Failed to update profanity filter. Please try again.');
      }
    });
  }


  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  scrollToTop(): void {
    this.showDropdown = false;
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  exportMessages(): void {
    this.showDropdown = false;
    const messagesToExport = this.searchActive ? this.filteredMessages : this.messages;
    const exportContent = messagesToExport.map(m =>
      `[${m.timestamp}] User ${m.senderId}: ${m.content}`
    ).join('\n\n');

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${this.chatId}_export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


  private loadInitialMessages(): void {
    this.loadingMessages = true;
    this.chatService.getMessages(this.chatId).subscribe({
      next: async (messages: Message[]) => {
        console.log('Received messages:', messages);
        this.messages = messages;
        this.loadingMessages = false;
        this.shouldScrollToBottom = true;

        // Extract unique sender IDs
        const senderIds = Array.from(new Set(messages.map(m => m.senderId)));

        // Fetch usernames for each sender
        for (const senderId of senderIds) {
          if (!this.senderUserMap[senderId]) {
            try {
              const user = await firstValueFrom(this.chatService.getUserById(senderId));
              this.senderUserMap[senderId] = user?.username ?? 'Unknown';
            } catch (err) {
              console.error(`Failed to fetch user for senderId ${senderId}`, err);
              this.senderUserMap[senderId] = 'Unknown';
            }

          }
        }
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.loadingMessages = false;
      }
    });
  }


  performSearch(): void {
    if (!this.searchQuery.trim()) {
      this.searchActive = false;
      return;
    }

    this.searchActive = true;
    const query = this.searchQuery.toLowerCase();
    this.filteredMessages = this.messages.filter(message =>
      message.content.toLowerCase().includes(query)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchActive = false;
  }

  highlightMatches(content: string): string {
    if (!this.searchActive) return content;
    const query = this.searchQuery.toLowerCase();
    const regex = new RegExp(query, 'gi');
    return content.replace(regex, match => `<span class="highlight">${match}</span>`);
  }

  private subscribeToNewMessages(): void {
    this.messageSubscription = this.chatService.subscribeToChat(this.chatId).subscribe({
      next: async (data: any) => {
        if (data.action === 'DELETED') {
          this.messages = this.messages.filter(m => m.id !== data.messageId);
        }
        else if (data.id) { // It's a regular message or update
          const existingIndex = this.messages.findIndex(m => m.id === data.id);

          // Fetch username if sender is new
          if (!this.senderUserMap[data.senderId]) {
            try {
              const user = await firstValueFrom(this.chatService.getUserById(data.senderId));
              this.senderUserMap[data.senderId] = user?.username ?? 'Unknown';
            } catch (err) {
              console.error(`Failed to fetch user for senderId ${data.senderId}`, err);
              this.senderUserMap[data.senderId] = 'Unknown';
            }
          }

          if (existingIndex >= 0) {
            // Update existing message
            this.messages = [
              ...this.messages.slice(0, existingIndex),
              data,
              ...this.messages.slice(existingIndex + 1)
            ];
          } else {
            // Add new message
            if (!this.messageExists(data)) {
              this.messages = [...this.messages, data];
              this.shouldScrollToBottom = true;
            }
          }
        }
      },
      error: (err) => console.error('Error receiving messages:', err)
    });
  }

  private messageExists(newMessage: Message): boolean {
    return this.messages.some(m =>
      m.id === newMessage.id ||
      (m.timestamp === newMessage.timestamp &&
        m.senderId === newMessage.senderId &&
        m.content === newMessage.content)
    );
  }

  trackByMessage(index: number, message: Message): string {
    return `${message.id}-${message.timestamp}-${this.searchActive}`;
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim()) return;
    const message: Message = {
      chatId: this.chatId,
      senderId: this.currentUserId, // Use currentUserId here
      content: this.newMessage,
      timestamp: new Date().toISOString()
    };
    try {
      this.chatService.sendMessage(message);
      this.newMessage = '';
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.typingTimeout);
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  protected scrollToBottom(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }

  editMessage(message: Message) {
    this.messages.forEach(m => m.showMenu = false);
    message.isEditable = true;
    this.editingContent = message.content;
    message.showMenu = false;
  }

  saveEdit(message: Message) {
    this.chatService.updateMessage(message.id!, this.chatId!, this.editingContent!)
      .then(() => {
        message.isEditable = false;
        this.editingContent = '';
      })
      .catch(err => console.error('Failed to update message:', err));
  }

  cancelEdit(message: Message) {
    message.isEditable = false;
    this.editingContent = '';
  }

  deleteMessage(message: Message) {
    if (!message.id) {
      console.error('Cannot delete message - messageId is undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this message?')) {
      this.chatService.deleteMessage(message.id, this.chatId)
        .catch(err => console.error('Failed to delete message:', err));
    }
    message.showMenu = false;
  }

  toggleMenu(message: Message) {
    // Close all other menus first
    this.messages.forEach(m => m.showMenu = false);
    // Toggle this message's menu
    message.showMenu = !message.showMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.messages) return;

    const clickedInsideDropdown = (event.target as HTMLElement).closest('.dropdown');
    if (!clickedInsideDropdown) {
      this.showDropdown = false;
    }

    const clickedInsideMenu = (event.target as HTMLElement).closest('.action-menu, .menu-btn');
    if (!clickedInsideMenu) {
      this.messages.forEach(m => m.showMenu = false);
    }
  }

  toggleUser() {
    this.senderId = this.senderId === 123 ? 456 : 123;
  }

  onTyping(): void {
    clearTimeout(this.typingTimeout);
    this.chatService.sendTypingIndicator(this.chatId, this.currentUserId, true);
    this.typingTimeout = setTimeout(() => {
      this.chatService.sendTypingIndicator(this.chatId, this.currentUserId, false);
    }, 2000);
  }


  async subscribeToTypingIndicators(): Promise<void> {
    this.chatService.subscribeToTypingIndicators(this.chatId).subscribe(async (indicator: any) => {
      if (indicator.senderId === this.currentUserId) return;

      try {
        const user = await firstValueFrom(this.chatService.getUserById(indicator.senderId));
        const username = user?.username ?? 'Unknown';

        if (indicator.typing) {
          this.typingUsernames.add(username);
        } else {
          this.typingUsernames.delete(username);
        }
      } catch (err) {
        console.error(`Failed to fetch user for senderId ${indicator.senderId}`, err);
      }
    });
  }

  getTypingIndicatorText(): string {
    const usernames = Array.from(this.typingUsernames);

    if (usernames.length === 0) return '';
    if (usernames.length === 1) return `${usernames[0]} is typing...`;
    if (usernames.length === 2) return `${usernames[0]} and ${usernames[1]} are typing...`;

    return `${usernames.slice(0, -1).join(', ')}, and ${usernames[usernames.length - 1]} are typing...`;
  }

  handleProfanityToggleRequest(): void {
    // Show confirmation regardless of current state
    this.showProfanityConfirm = true;
  }

  confirmProfanityToggle(confirmed: boolean): void {
    if (confirmed) {
      this.toggleProfanityFilter(); // Enable or disable
    }
    this.showProfanityConfirm = false;
  }

  openDeleteConfirmation(message: Message) {
    this.selectedMessageToDelete = message;
  }

  confirmDelete() {
    if (!this.selectedMessageToDelete?.id) {
      console.error('Cannot delete message - messageId is undefined');
      return;
    }

    this.chatService.deleteMessage(this.selectedMessageToDelete.id, this.chatId)
      .then(() => {
        // Optionally update the local message list (if not handled via WebSocket)
        this.messages = this.messages.filter(m => m.id !== this.selectedMessageToDelete?.id);
      })
      .catch(err => {
        console.error('Failed to delete message:', err);
      });

    this.selectedMessageToDelete = null; // Close modal
  }

  cancelDelete() {
    this.selectedMessageToDelete = null;
  }

}
