import {Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import {FirebaseUser} from "src/app/interfaces/firebase-user";
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
	inProgressUserUids: string[] = [];

	suggestedUsers: FirebaseUser[] = [];

	showingModal: boolean = false;

	constructor(public Store: StoreService, private Firebase: FirebaseService, private router: Router) {}

   ngOnInit() {
      this.Firebase.loadSelectableChats(() => {
         this.Store.allChatsMembers.forEach((user: FirebaseUser) => {
            this.Store.allChatsShownData[user.uid] = {
               photoURL: user.photoURL,
               username: user.username
            }
         });
      });
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

	clearSuggestedUsers() {
		this.suggestedUsers = [];
   }
   
   finishNewChat() {
      this.Firebase.createNewChat(this.inProgressUsers, this.newChatName, (newChatUid: string) => {
         this.Store.activeChatId = newChatUid;
         this.Firebase.loadActiveChatData(() => {
            console.log("Chat creation and load has completed. Dumping gathered data:");
            console.log(this.Store.activeChatMeta);
            console.log(this.Store.activeChatMembers);
            this.router.navigate(["conversation"]);
         });
      });
   }

	addNewUser(user: FirebaseUser) {
		if (!this.inProgressUserUids.includes(user.uid)) {
			this.inProgressUserUids.push(user.uid);
			this.Firebase.fetchSingleUserByUid(user.uid, (user: FirebaseUser) => {
				this.inProgressUsers.push(user);
         });
         this.clearSuggestedUsers();
		}
	}

	handleKeyDown(event: any, input: string) {
		switch (input) {
			case "groupname":
				break;
			case "usersearch":
				if (event.key == "Enter") {
					this.Firebase.fetchUsersByUsername(this.searchTerm, (data: FirebaseUser[]) => {
						this.suggestedUsers = data;
					});
				}
				break;
		}
	}
}
