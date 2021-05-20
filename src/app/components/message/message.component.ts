import {Component, HostBinding, Input, OnInit} from "@angular/core";
import {ChatMessage} from "src/app/interfaces/chat-message";
import {FirebaseUser} from "src/app/interfaces/firebase-user";
import {FirebaseService} from "src/app/services/firebase.service";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-message",
	templateUrl: "./message.component.html",
	styleUrls: ["./message.component.scss"],
})
export class MessageComponent implements OnInit {
	@Input() message: ChatMessage;

	@HostBinding("class.sent") fromSelf: boolean = false;

	private emptyMessage: ChatMessage = {
		senderName: "NONE",
		senderPhotoURL: "assets/error.png",
		senderUID: "NONE",
		url: "",
		timestamp: 0,
	};

	constructor(public Store: StoreService, private Firebase: FirebaseService) {
		this.message = this.emptyMessage;
	}

	ngOnInit(): void {
		if (this.message.senderUID == this.Store.activeUser_Firebase.uid) {
			this.fromSelf = true;
		}
	}

	removeFromFavorites() {
		this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, "removeFromFavorites", this.message.url);
	}

	addToFavorites() {
		this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, "addToFavorites", this.message.url);
	}
}
