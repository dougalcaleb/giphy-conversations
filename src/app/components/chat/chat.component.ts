import {Component, Input, OnInit} from "@angular/core";
import {FirebaseService} from "src/app/services/firebase.service";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-chat",
	templateUrl: "./chat.component.html",
	styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
	@Input() members: any[] = [];
	@Input() last: any = {
		from: "NONE",
		timestamp: 0,
		url: "NONE",
	};
	@Input() name: string = "NEW CHAT";
	@Input() uid: string = "NONE";

	constructor(public Store: StoreService, private Firebase: FirebaseService) {}

	ngOnInit(): void {}

   leaveGroup() {
      this.Firebase.removeMemberFromGroup(this.uid);
   }

   selectChat() {
      this.Store.activeChatId = this.uid;
      this.Firebase.loadActiveChatData(() => {
         console.log("Chat load has completed. Dumping gathered data:");
         console.log(this.Store.activeChatMeta);
         console.log(this.Store.activeChat_Members);
      });
   }
}
