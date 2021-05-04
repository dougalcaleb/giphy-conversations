import {Injectable} from "@angular/core";
import {User} from "../models/user";
import {FirebaseService} from "./firebase.service";

@Injectable({
	providedIn: "root",
})
export class StoreService {
	// User data
	public activeUser_Google: any = null;
	public activeUser_Firebase: User | any;
	public loggedIn: boolean = false;
	public activeChat: string = "";
	public isNewUser: boolean = false;
	public chatsMeta: any = [];
	public loadedChats: any = [];
	public activeChatMeta: any;

	public static defaultFirebaseUser = {
		uid: "NONE",
		email: "NONE",
		photoURL: "NONE",
		displayName: "NONE",
		color: "NONE",
		username: "NONE",
		chats: [],
		favoritedGifs: [],
	};

   constructor() {}

	saveUser() {
		sessionStorage.setItem("GC_loggedInUser_Google", JSON.stringify(this.activeUser_Google));
		sessionStorage.setItem("GC_loggedInUser_Firebase", JSON.stringify(this.activeUser_Firebase));
	}

	clearUserData(clearSession = true) {
		this.activeUser_Google = null;
		this.activeUser_Firebase = StoreService.defaultFirebaseUser;
		this.loggedIn = false;
		this.activeChat = "";
		this.isNewUser = false;
		if (clearSession) {
			sessionStorage.removeItem("GC_loggedInUser_Google");
			sessionStorage.removeItem("GC_loggedInUser_Firebase");
		}
	}
}
