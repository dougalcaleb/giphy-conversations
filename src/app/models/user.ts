export interface User {
   uid: string;
   email: string;
   photoURL: string;
   displayName: string;
   color?: string;
   username: string;
   chats: Array<any>;
   favoritedGifs: Array<any>;
}
