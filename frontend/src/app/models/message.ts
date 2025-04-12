export interface Message {
  id?: string;
  chatId: number;
  senderId: number;
  content: string;
  timestamp: string;
}
