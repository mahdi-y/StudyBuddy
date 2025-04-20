import {Component, OnInit, OnDestroy, HostListener, Input, SimpleChanges} from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';
import { Message } from '../../models/message';

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

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadInitialMessages();
    this.subscribeToNewMessages();
    this.shouldScrollToBottom = true;
    this.loadChatSettings();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId'] && !changes['chatId'].firstChange) {
      this.messages = [];
      this.messageSubscription?.unsubscribe();
      this.loadInitialMessages();
      this.subscribeToNewMessages();
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
      container.scrollTop = 0;
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
      next: (messages: Message[]) => {
        console.log('Received messages:', messages);
        this.messages = messages;
        this.loadingMessages = false;
        this.shouldScrollToBottom = true;
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
      next: (data: any) => {
        if (data.action === 'DELETED') {
          this.messages = this.messages.filter(m => m.id !== data.messageId);
        }
        else if (data.id) { // It's a regular message or update
          const existingIndex = this.messages.findIndex(m => m.id === data.id);
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
      senderId: this.senderId,
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

  private scrollToBottom(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
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


}
