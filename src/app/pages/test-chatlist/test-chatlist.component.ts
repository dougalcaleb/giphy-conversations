import {Component, OnInit} from "@angular/core";
import { StoreService } from "src/app/services/store.service";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/app/models/user";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
	selector: "app-test-chatlist",
	templateUrl: "./test-chatlist.component.html",
	styleUrls: ["./test-chatlist.component.scss"],
})
export class TestChatlistComponent implements OnInit {

   inProgressUsers = [];
   inProgress = true;
   suggested: User[] = [];
   userSearchTerm = "";
   // config
   searchThrottle = 500;

	constructor(public Store: StoreService, private firebase: FirebaseService) {}

   ngOnInit(): void {

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

   handleKey(event: any) {
      if (event.key == "Enter") {
         this.search();
         // event.target.value = "";
		}
   }

   search() {
      this.suggested = [];
      let st = this.userSearchTerm;
      if (this.userSearchTerm.split("")[0] == "@") {
         st = this.userSearchTerm.split("").slice(1).join("");
         console.log(`Adjusted search term to '${st}'`);
      }
      this.firebase.searchUser(st, (data: any) => {
         if (data == null) {

         } else {
            this.suggested.push(data);
         }
      });
      // this.userSearchTerm = "";
   }
}