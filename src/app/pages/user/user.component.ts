import {Component, OnInit} from "@angular/core";
import {User} from "src/app/models/user";
import {StoreService} from "src/app/services/store.service";
import {FirebaseService} from "src/app/services/firebase.service";

@Component({
	selector: "app-user",
	templateUrl: "./user.component.html",
	styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
	constructor(public Store: StoreService, private Firebase: FirebaseService) {}
	display = false;
	toggle() {
		if (this.display == false) {
			this.display = true;
		} else {
			this.display = false;
		}
	}

	updateInfo() {
		this.toggle();
		this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, this.Store.activeUser_Firebase.color, "changeColor");
		this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, this.Store.activeUser_Firebase.username, "changeUsername");
		this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, this.Store.activeUser_Firebase.displayName, "changeDisplayName");
	}

	ngOnInit(): void {
		this.Firebase.loadUserChats();
	}
}
