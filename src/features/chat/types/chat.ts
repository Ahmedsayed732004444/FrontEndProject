export interface Message {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
}
