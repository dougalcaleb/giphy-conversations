import { Injectable } from "@angular/core";
// interfaces
import {ChatMeta} from "../interfaces/chat-meta";
import {FirebaseUser} from "../interfaces/firebase-user";

@Injectable({
	providedIn: "root",
})
export class StoreService {
	public activeUser_Google: any = null;
	public activeUser_Firebase: FirebaseUser;
	public loggedIn: boolean = false;
	public activeChatId: string = "";
	public isNewUser: boolean = false;
	public chatsMeta: Array<ChatMeta> = [];
	public loadedChatIds: Array<String> = [];
	public activeChatMeta: ChatMeta;

	public static defaultUser_Firebase: FirebaseUser = {
		uid: "NONE",
		email: "NONE",
		photoURL: "NONE",
		displayName: "NONE",
		username: "NONE",
		chats: [],
      favoritedGifs: [],
      color: "black",
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

	constructor() {
		this.activeUser_Firebase = StoreService.defaultUser_Firebase;
		this.activeChatMeta = StoreService.defaultChatMeta;
	}

	public saveUser() {
		sessionStorage.setItem("GC_loggedInUser_Google", JSON.stringify(this.activeUser_Google));
		sessionStorage.setItem("GC_loggedInUser_Firebase", JSON.stringify(this.activeUser_Firebase));
   }
   
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
