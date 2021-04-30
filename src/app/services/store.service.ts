import {Injectable} from "@angular/core";
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
}
