import {Injectable} from "@angular/core";
import {User} from "../models/user";

@Injectable({
	providedIn: "root",
})
export class StoreService {
	// User data
	public activeUser_Google: any = null;
	public activeUser_Firebase: User;
	public loggedIn: boolean = false;
   public activeChat: string = "";


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

	display = false;

	constructor() {
      this.activeUser_Firebase = StoreService.defaultFirebaseUser;
	}
}
