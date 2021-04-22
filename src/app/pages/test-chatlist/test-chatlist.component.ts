import {Component, OnInit} from "@angular/core";
import { StoreService } from "src/app/services/store.service";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/app/models/user";

@Component({
	selector: "app-test-chatlist",
	templateUrl: "./test-chatlist.component.html",
	styleUrls: ["./test-chatlist.component.scss"],
})
export class TestChatlistComponent implements OnInit {

   inProgressUsers = [];
   inProgress = true;
   suggested: User[] = [];

	constructor(public Store: StoreService) {}

	ngOnInit(): void {
      console.log(this.Store.loggedIn);
   }

   startNewChat() {}
   
   newChat() {
      let chat = {
         messages: [],
         members: [],
         name: "",
         uid: uuidv4(),
      }
      this.Store.activeUser.chats.push(chat.uid);
   }

}
