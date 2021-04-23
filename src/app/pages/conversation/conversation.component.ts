import {Component, OnInit} from "@angular/core";
import {FirebaseService} from "src/app/services/firebase.service";
import { GiphyService } from "src/app/services/giphy.service";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-conversation",
	templateUrl: "./conversation.component.html",
	styleUrls: ["./conversation.component.scss"],
})
export class ConversationComponent implements OnInit {
	heart = "assets/heartOutline.png";
	messages: any = [];

	searchTerm = "";
	searchResult: any;
	retrieved = false;
	cache = true;

	constructor(private Store: StoreService, private firebase: FirebaseService, private Giphy: GiphyService) {
		this.messages.forEach((message: any) => {
			message.type = this.Store.activeUser.uid == message.user ? "sent" : "";
		});
	}

	toggleModal() {
		if (this.Store.display == false) {
			this.Store.display = true;
		} else {
			this.Store.display = false;
		}
	}

	heartToggle() {
		if (this.heart == "assets/heartOutline.png") {
			this.heart = "assets/heart.png";
		} else {
			this.heart = "assets/heartOutline.png";
		}
	}

	ngOnInit(): void {
    this.getMessages();
  }
  
  getMessages() {
    this.firebase.getChat("test-chat", (data: any) => {
			this.messages = data;
			this.messages.forEach((message: any) => {
				if (message.user == this.Store.activeUser.uid) {
					this.messages[this.messages.indexOf(message)].type = "sent";
					this.messages[this.messages.indexOf(message)].senderName = "you";
				} else {
					this.messages[this.messages.indexOf(message)].type = "";
				}
			});
		});
  }

	search(event: any) {
		if (event.key == "Enter") {
			console.log(this.searchTerm);
			this.getSearch();
		}
	}

	getTrendingData() {
		this.Giphy.getTrending();
  }
  
  selectGif(url: any) {
    this.firebase.sendMessage(url, () => {
      this.getMessages();
    });
  }

	async getSearch() {
		if (this.cache && localStorage.getItem("gif-cache")) {
			this.searchResult = JSON.parse(localStorage.getItem("gif-cache") || "");
			this.retrieved = true;
			return;
		}
		console.log("Initializing Search with term", this.searchTerm);
		this.Giphy.getSearch(this.searchTerm).then(
			(data) => {
				console.log("Retrieval was successful. Outputting data:");
				console.log("Raw:");
				console.log(data);
				this.searchResult = data;
				this.retrieved = true;
				if (this.cache) {
					localStorage.setItem("gif-cache", JSON.stringify(this.searchResult));
				}
			},
			() => {
				console.error("Search failed.");
			}
		);
	}
}
