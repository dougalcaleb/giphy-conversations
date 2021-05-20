export interface ChatMessage {
   senderName: string;
   senderPhotoURL: string;
   senderUID: string;
   url: string;
   timestamp: number;
   message?: string;
}
