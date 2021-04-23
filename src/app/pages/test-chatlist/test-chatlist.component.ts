import {Component, OnInit} from "@angular/core";
import {StoreService} from "src/app/services/store.service";
import {v4 as uuidv4} from "uuid";
import {User} from "src/app/models/user";
import {FirebaseService} from "src/app/services/firebase.service";

@Component({
	selector: "app-test-chatlist",
	templateUrl: "./test-chatlist.component.html",
	styleUrls: ["./test-chatlist.component.scss"],
})
export class TestChatlistComponent implements OnInit {
	inProgressUsers: any = [];
	inProgressUsersUIDs: any = [];
	suggested: User[] = [];

	userSearchTerm = "";
	inProgress = true;
	// config
	searchThrottle = 500;

	constructor(public Store: StoreService, private firebase: FirebaseService) {}

	ngOnInit(): void {}

	startNewChat() {}

   finishNewChat() {
      let chatId = uuidv4();
      this.firebase.createChat(chatId);
      this.inProgressUsers.forEach((user:any) => {
         this.firebase.updateUser(user.uid, chatId, "newChat");
      });
      this.firebase.updateUser(this.Store.activeUser.uid, chatId, "newChat");
   }

	newChat() {
		let chat = {
			messages: [],
			members: [],
			name: "",
			uid: uuidv4(),
		};
		this.Store.activeUser.chats.push(chat.uid);
	}

	handleKey(event: any) {
		if (event.key == "Enter") {
			this.search();
			// event.target.value = "";
		}
	}

	selectUser(uid: any) {
		this.suggested.forEach((user) => {
         if (
            user.uid == uid && // looping user is the selected user
            !this.inProgressUsersUIDs.includes(user.uid) && // has not been selected already
            user.uid != "ERROR" && // is not the error message
            user.uid != this.Store.activeUser.uid // is not self
         ) {
				this.inProgressUsers.push(user);
				this.inProgressUsersUIDs.push(user.uid);
				this.clearSuggested();
			}
		});
	}

	clearSuggested() {
		this.suggested = [];
		this.userSearchTerm = "";
	}

	search() {
		this.suggested = [];
		let st = this.userSearchTerm;
		if (this.userSearchTerm.split("")[0] == "@") {
			st = this.userSearchTerm.split("").slice(1).join("");
			// console.log(`Adjusted search term to '${st}'`);
		}
		this.firebase.searchUser(st, (data: any) => {
         if (data == null) {
            this.suggested.push({
               uid: "ERROR",
               photoURL: "assets/error.png",
               username: "",
               displayName: "User does not exist"
            } as User)
			} else {
				this.suggested.push(data);
			}
		});
	}
}
