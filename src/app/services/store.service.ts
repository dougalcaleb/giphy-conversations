import { Injectable } from "@angular/core";
import { ChatMessage } from "../interfaces/chat-message";
// interfaces
import {ChatMeta} from "../interfaces/chat-meta";
import {FirebaseUser} from "../interfaces/firebase-user";

@Injectable({
	providedIn: "root",
})
export class StoreService {
   public activeUser_Google: any = null;                 // Data gathered from Google sign-in
   public activeUser_Firebase: FirebaseUser;             // Data stored in and pushed to Firebase
   public loggedIn: boolean = false;                     // Whether there is a logged in user or not
	public activeChatId: string = "";                     // The current active chat
	public isNewUser: boolean = false;                    // If this logon is the user's first (does some setting up)
	public allChatsMeta: Array<ChatMeta> = [];            // Stores the metadata from Firebase for all chats the user is in
	public loadedChatIds: Array<string> = [];             // Stores the IDs for all chats the user is in
   public activeChatMeta: ChatMeta;                      // Metadata for the active chat
   public activeChatMembers: Array<FirebaseUser> = [];   // Users in the active chat
   public activeChatAllMessages: ChatMessage[] = [];     // All messages for the current chat
   public activeChatShownMessages: ChatMessage[] = [];   // Shown messages for the current chat. Does not include messages that have not been loaded
   public allChatsMembers: Array<FirebaseUser> = [];     // Users in all chats the logged in user is in
   public allChatsShownData: any = {};                   // Exclusively for chat.html, gives easy accessible username and photo url
   public newProfileImage: any;

	public static defaultUser_Firebase: FirebaseUser = {
		uid: "NONE",
		email: "NONE",
		photoURL: "NONE",
		displayName: "NONE",
		username: "NONE",
		chats: [],
      favoritedGifs: [],
      // color: "black",
      sentGifs: 0,
	};

	public static defaultChatMeta: ChatMeta = {
		last: {
			from: "NONE",
			timestamp: 0,
			url: "NONE",
		},
		members: [],
		name: "NONE",
		uid: "NONE",
   };
   
   public static blankUserImage: string = "assets/svgs/user.svg";
   public blankUserImage: string = "assets/svgs/user.svg";

	constructor() {
		this.activeUser_Firebase = StoreService.defaultUser_Firebase;
		this.activeChatMeta = StoreService.defaultChatMeta;
	}

   // Saves user to session storage to prevent relogin on refresh
	public saveUser() {
		sessionStorage.setItem("GC_loggedInUser_Google", JSON.stringify(this.activeUser_Google));
		sessionStorage.setItem("GC_loggedInUser_Firebase", JSON.stringify(this.activeUser_Firebase));
   }

   public clearSavedUser() {
      sessionStorage?.removeItem("GC_loggedInUser_Google");
      sessionStorage?.removeItem("GC_loggedInUser_Firebase");
   }
   
   // Returns a string that says how long it has been since the given timestamp
   public getTimeSince(date: any): string {
		var seconds = Math.floor((Date.now() - date) / 1000);
		var interval = seconds / 31536000;
      if (interval > 1) {
         if (Math.floor(interval) > 5) {
            return "a very long time ago"
         }
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " year ago" : " years ago");
		}
		interval = seconds / 2592000;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " month ago" : " months ago");
		}
		interval = seconds / 86400;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " day ago" : " days ago");
		}
		interval = seconds / 3600;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " hour ago" : " hours ago");
		}
		interval = seconds / 60;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " minute ago" : " minutes ago");
		}
		return "Just now";
	}
}
