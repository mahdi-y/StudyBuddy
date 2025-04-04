import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  messages: any[] = [];
  newMessage: string = '';
  chatId!: number;
  userId: number = 1;

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chatId = Number(this.route.snapshot.paramMap.get('chatId'));
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  async loadMessages(): Promise<void> {
    try {
      const messages = await firstValueFrom(this.messageService.getMessages(this.chatId, this.userId));
      this.messages = messages.map(message => {
        return {
          ...message,
          timestamp: new Date(message.timestamp)
        };
      });
      this.scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim()) {
      try {
        const message = await firstValueFrom(this.messageService.sendMessage(this.chatId, this.userId, this.newMessage));
        this.messages.push({
          ...message,
          timestamp: new Date(message.timestamp)
        });
        this.newMessage = '';
        this.scrollToBottom();
      } catch (error) {
        console.error('Error sending message', error);
      }
    }
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom', err);
    }
  }
}
