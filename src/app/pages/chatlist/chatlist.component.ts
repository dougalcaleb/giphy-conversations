import {Component, OnInit} from "@angular/core";
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

	clearSuggestedUsers() {
		this.suggestedUsers = [];
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
