import {Component, OnInit} from "@angular/core";
import {FirebaseService} from "src/app/services/firebase.service";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-chatlist",
	templateUrl: "./chatlist.component.html",
	styleUrls: ["./chatlist.component.scss"],
})
export class ChatlistComponent implements OnInit {

	constructor(public Store: StoreService, private Firebase: FirebaseService) {}

	ngOnInit(): void {
		this.Firebase.loadSelectableChats();
	}
}
