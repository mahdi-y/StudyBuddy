export interface Message {
  id?: number;
  chatId: number;
  senderId: number;
  content: string;
  timestamp: string;
  isEditable?: boolean;
  showMenu?: boolean;
}
