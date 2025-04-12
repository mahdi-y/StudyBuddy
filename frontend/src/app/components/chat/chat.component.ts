import { Component, OnInit, OnDestroy } from '@angular/core';
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
  chatId = 1;
  senderId = 123;
  loadingMessages = false;
  private messageSubscription: Subscription | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadInitialMessages();
    this.subscribeToNewMessages();
  }

  private loadInitialMessages(): void {
    this.loadingMessages = true;
    this.chatService.getMessages(this.chatId).subscribe({
      next: (messages: Message[]) => {
        console.log('Received messages:', messages);
        this.messages = messages;
        this.loadingMessages = false;
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.loadingMessages = false;
      }
    });
  }

  private subscribeToNewMessages(): void {
    this.messageSubscription = this.chatService.subscribeToChat(this.chatId).subscribe({
      next: (message: Message) => {
        if (!this.loadingMessages && !this.messageExists(message)) {
          this.messages = [...this.messages, message];
        }
      },
      error: (err) => {
        console.error('Error receiving messages:', err);
      }
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
    return `${message.id}-${message.timestamp}`;
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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

}
