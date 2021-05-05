import {Component, OnInit} from "@angular/core";
import { FirebaseUser } from "src/app/interfaces/firebase-user";
import {FirebaseService} from "src/app/services/firebase.service";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-chatlist",
	templateUrl: "./chatlist.component.html",
	styleUrls: ["./chatlist.component.scss"],
})
export class ChatlistComponent implements OnInit {

   // modal variables
   newChatName = "New Group";
   searchTerm = "";
   inProgressUsers: FirebaseUser[] = [];
   inProgressUserUids: string[] = []

   showingModal: boolean = true;

	constructor(public Store: StoreService, private Firebase: FirebaseService) {}

	ngOnInit(): void {
		this.Firebase.loadSelectableChats();
   }
   
   cancelNewChat() {
      this.showingModal = false;
      this.newChatName = "New Group";
      this.searchTerm = "";
      this.inProgressUsers = [];
   }

   showNewChatModal() {
      this.showingModal = true;
   }

   addNewUser(uid: any) {
      this.inProgressUserUids.push(uid);
      this.Firebase.fetchSingleUserByUid(uid, (user: FirebaseUser) => {
         this.inProgressUsers.push(user);
      });
   }
}
