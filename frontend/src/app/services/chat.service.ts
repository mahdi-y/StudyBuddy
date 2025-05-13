import { Injectable, OnDestroy } from '@angular/core';
import {Client, IMessage} from '@stomp/stompjs';
import {Observable, Subject, BehaviorSubject, lastValueFrom} from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private stompClient: Client;
  private messageSubject: Subject<any> = new Subject<any>();
  private connectionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subscriptions = new Map<number, string>();

  constructor(private http: HttpClient) {
    this.stompClient = new Client({
      brokerURL: `${environment.websocketUrl}/websocket`,
      connectHeaders: {
        login: '',
        passcode: '',
      },
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 5000
    });

    this.setupStompCallbacks();
    this.stompClient.activate();
  }

  getMessages(chatId: number): Observable<any[]> {
    console.log(`Fetching messages for chatId: ${chatId}`);
    return this.http.get<any[]>(`${environment.apiUrl}/api/messages/${chatId}`);
  }

  private setupStompCallbacks(): void {
    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket connected:', frame);
      this.connectionSubject.next(true);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body);
      this.connectionSubject.next(false);
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
      this.connectionSubject.next(false);
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('WebSocket disconnected:', frame);
      this.connectionSubject.next(false);
    };
  }

  get connectionStatus$(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }

  subscribeToChat(chatId: number): Observable<any> {
    return new Observable(observer => {
      const subscriptionId = `sub-${chatId}-${Date.now()}`;

      const connectSubscription = this.connectionSubject.subscribe(isConnected => {
        if (isConnected) {
          if (this.subscriptions.has(chatId)) {
            this.stompClient.unsubscribe(this.subscriptions.get(chatId)!);
          }

          const subscription = this.stompClient.subscribe(
            `/topic/chats/${chatId}`,  // Match backend exactly
            (message: IMessage) => {
              try {
                const parsedMessage = JSON.parse(message.body);
                this.messageSubject.next(parsedMessage);
                observer.next(parsedMessage);
              } catch (e) {
                console.error('Error parsing message:', e);
                observer.error(e);
              }
            },
            { id: subscriptionId }
          );

          this.subscriptions.set(chatId, subscriptionId);
        }
      });

      return () => {
        connectSubscription.unsubscribe();
        if (this.subscriptions.has(chatId)) {
          this.stompClient.unsubscribe(this.subscriptions.get(chatId)!);
          this.subscriptions.delete(chatId);
        }
      };
    });
  }

  async sendMessage(message: any): Promise<void> {
    if (!this.connectionSubject.value) {
      throw new Error('Not connected to WebSocket');
    }

    // Send the message without needing to subscribe to receipts or handle timeouts
    this.stompClient.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json',
        'receipt': `receipt-${Date.now()}` // Send receipt header for acknowledgment
      }
    });

    // Optionally, listen for the acknowledgment from the backend
    this.stompClient.subscribe(`/queue/receipts`, (message: IMessage) => {
      console.log('Message processed acknowledgment received:', message.body);
      // Handle any post-processing if needed, like updating UI state or confirming message delivery
    });
  }

  ngOnDestroy(): void {
    this.stompClient.deactivate();
    this.messageSubject.complete();
    this.connectionSubject.complete();
  }

  deleteMessage(messageId: number, chatId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connectionSubject.value) {
        reject(new Error('Not connected to WebSocket'));
        return;
      }

      this.stompClient.publish({
        destination: '/app/deleteMessage',
        body: JSON.stringify({ messageId, chatId }),
        headers: { 'content-type': 'application/json' }
      });
      resolve();
    });
  }

  updateMessage(messageId: number, chatId: number, newContent: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connectionSubject.value) {
        reject(new Error('Not connected to WebSocket'));
        return;
      }

      this.stompClient.publish({
        destination: '/app/updateMessage',
        body: JSON.stringify({ messageId, chatId, newContent }),
        headers: { 'content-type': 'application/json' }
      });
      resolve();
    });
  }

  getChatSettings(chatId: number): Observable<{ profanityFilterEnabled: boolean }> {
    return this.http.get<{ profanityFilterEnabled: boolean }>(`${environment.apiUrl}/${chatId}/settings`);
  }

  updateChatSettings(chatId: number, settings: { profanityFilterEnabled: boolean }): Observable<any> {
    console.log('Sending updateChatSettings request for chatId:', chatId, 'with settings:', settings);
    return this.http.patch(`${environment.apiUrl}/${chatId}/settings`, settings);
  }

  sendTypingIndicator(chatId: number, senderId: number, isTyping: boolean): void {
    if (!this.connectionSubject.value) {
      throw new Error('Not connected to WebSocket');
    }
    console.log(`Sending typing indicator: ${isTyping} for chatId: ${chatId}, senderId: ${senderId}`);
    this.stompClient.publish({
      destination: '/app/typingIndicator',
      body: JSON.stringify({ chatId, senderId, typing: isTyping }),
      headers: { 'content-type': 'application/json' },
    });
  }


  subscribeToTypingIndicators(chatId: number): Observable<any> {
    return new Observable(observer => {
      const subscriptionId = `typing-${chatId}-${Date.now()}`;

      const connectSubscription = this.connectionSubject.subscribe(isConnected => {
        if (isConnected) {
          this.stompClient.subscribe(`/topic/chats/${chatId}`, (message: IMessage) => {
            try {
              const parsedMessage = JSON.parse(message.body);
              console.log('Received typing indicator:', parsedMessage);
              observer.next(parsedMessage);
            } catch (e) {
              console.error('Error parsing typing indicator:', e);
              observer.error(e);
            }
          });
        }
      });

      return () => {
        connectSubscription.unsubscribe();
      };
    });
  }

  reportMessageViaWebSocket(chatId: number, messageId: number, reporterId: number, reason: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connectionSubject.value) {
        reject(new Error('Not connected to WebSocket'));
        return;
      }

      this.stompClient.publish({
        destination: '/app/reportMessage',
        body: JSON.stringify({ chatId, messageId, reporterId, reason }),
        headers: { 'content-type': 'application/json' }
      });
      resolve();
    });
  }

  subscribeToReports(): Observable<any> {
    return new Observable(observer => {
      console.log('Subscribing to /topic/reports');

      // Subscribe to the connection status
      const connectionSubscription = this.connectionSubject.subscribe(isConnected => {
        if (isConnected) {
          // WebSocket is connected; proceed with subscription
          const subscription = this.stompClient.subscribe('/topic/reports', (message: IMessage) => {
            try {
              const parsedMessage = JSON.parse(message.body);
              observer.next(parsedMessage);
            } catch (e) {
              console.error('Error parsing report:', e);
              observer.error(e);
            }
          });

          // Return cleanup function to unsubscribe
          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Return a no-op function when not connected
          return () => {};
        }
      });
    });
  }

  getReportedMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/reports`);
  }


  dismissReport(reportId: number): Promise<void> {
    const url = `${environment.apiUrl}/api/reports/dismiss/${reportId}`;
    return lastValueFrom(this.http.delete<void>(url));
  }

  getChatIdByStudyGroupId(studyGroupId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/study-group/${studyGroupId}`);
  }

  getUserById(id: number) {
    return this.http.get<{ username: string }>(`${environment.apiUrlUser}/api/users/${id}`);
  }

}
