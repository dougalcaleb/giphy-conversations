import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FirebaseService} from "src/app/services/firebase.service";
import {GiphyService} from "src/app/services/giphy.service";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-conversation",
	templateUrl: "./conversation.component.html",
	styleUrls: ["./conversation.component.scss"],
})
export class ConversationComponent implements AfterViewInit {
   @ViewChild("messageWrapper", { read: ElementRef }) public messageWrapper: any;
	heart = "assets/heartOutline.png";
	messages: any = [];

	searchTerm = "";
	searchResult: any = [];
   retrieved = false;
   offset = 0;


   cache = true;
   retrieveCount = 10;

	constructor(private Store: StoreService, private firebase: FirebaseService, private Giphy: GiphyService) {
		this.messages.forEach((message: any) => {
			message.type = this.Store.activeUser_Google.uid == message.user ? "sent" : "";
		});
	}
   
	toggleModal() {
		if (this.Store.display == false) {
			this.Store.display = true;
		} else {
			this.Store.display = false;
		}
	}

	heartToggle(gifUrl: any) {
		if (this.heart == "assets/heartOutline.png") {
			this.heart = "assets/heart.png";
		} else {
			this.heart = "assets/heartOutline.png";
		}
	}

	ngAfterViewInit(): void {
		this.getMessages();
		this.firebase.subscribeToChat(this.Store.activeChat, () => {
			console.log("Snapshot!!");
			this.getMessages();
		});
	}

	getMessages() {
		this.firebase.getChat("test-chat", (data: any) => {
			this.messages = data;
			this.messages.forEach((message: any) => {
				if (message.user == this.Store.activeUser_Google.uid) {
					this.messages[this.messages.indexOf(message)].type = "sent";
					this.messages[this.messages.indexOf(message)].senderName = "you";
				} else {
					this.messages[this.messages.indexOf(message)].type = "";
				}
				this.messages[this.messages.indexOf(message)].time = this.getTime(message.timestamp);
			});
		});
      // this.messageWrapper.nativeElement.scrollTop = this.messageWrapper.nativeElement.scrollHeight;
      setTimeout(() => {
         this.messageWrapper.nativeElement.scroll({
            top: this.messageWrapper.nativeElement.scrollHeight*2,
            left: 0,
            behavior: "smooth",
         });
      }, 300);
   }
   
   loadMore() {
      this.offset += this.retrieveCount;
      this.getSearch(this.offset);
   }

	getTime(date: any) {
		var seconds = Math.floor((Date.now() - date) / 1000);

		var interval = seconds / 31536000;

		if (interval > 1) {
			return Math.floor(interval) + " years ago";
		}
		interval = seconds / 2592000;
		if (interval > 1) {
			return Math.floor(interval) + " months ago";
		}
		interval = seconds / 86400;
		if (interval > 1) {
			return Math.floor(interval) + " days ago";
		}
		interval = seconds / 3600;
		if (interval > 1) {
			return Math.floor(interval) + " hours ago";
		}
		interval = seconds / 60;
		if (interval > 1) {
			return Math.floor(interval) + " minutes ago";
		}
		return "Just now";
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
         this.closeGifPicker();
      });
   }
   
   closeGifPicker() {
      this.searchResult = [];
      this.retrieved = false;
   }

   cancelGifPicker() {
      this.searchTerm = "";
      this.closeGifPicker();
   }

	async getSearch(startAt: any = 0) {
      if (this.cache && localStorage.getItem("gif-cache")) {
         let parsedData = JSON.parse(localStorage.getItem("gif-cache") || "");
         parsedData.data.forEach((gif: any) => {
            this.searchResult.push(gif);
         });
			this.retrieved = true;
			return;
		}
		// console.log("Initializing Search with term", this.searchTerm);
		this.Giphy.getSearch(this.searchTerm, startAt, this.retrieveCount).then(
			(data) => {
				// console.log("Retrieval was successful. Outputting data:");
				// console.log("Raw:");
            // console.log(data);
            data.data.forEach((gif:any) => {
               this.searchResult.push(gif);
            })
				// this.searchResult = data;
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
