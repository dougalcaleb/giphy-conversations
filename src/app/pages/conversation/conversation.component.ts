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
	@ViewChild("messageWrapper", {read: ElementRef}) public messageWrapper: any;

	heart = "assets/heartOutline.png";
	messages: any = [];
   allMessages: any = [];
	searchTerm = "";
	searchResult: any = [];
	retrieved = false;
	offset = 0;
	scrolled = false;
	scrollCheckInt: any;
   favoriteAllowed = true;
   choosingFavorite = false;
   endOffset = 0;

	// config
	cache = true;
	retrieveCount = 10;
	scrollAllowance = 500;
	favoriteCooldown = 1000;
   messagesToRecieve = 10;

	constructor(public Store: StoreService, private firebase: FirebaseService, private Giphy: GiphyService) {
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
      if (this.favoriteAllowed) { // helps prevent firebase input spam
         this.favoriteAllowed = false;
			// add favorite gif
			if (!this.Store.activeUser_Firebase.favoritedGifs.includes(gifUrl)) {
				this.Store.activeUser_Firebase.favoritedGifs.push(gifUrl);
				this.messages.forEach((message: any) => {
					if (this.Store.activeUser_Firebase.favoritedGifs.includes(message.url)) {
						this.messages[this.messages.indexOf(message)].heart = "assets/heart.png";
					} else {
						this.messages[this.messages.indexOf(message)].heart = "assets/heartOutline.png";
					}
            });
            this.firebase.updateUser(this.Store.activeUser_Firebase.uid, gifUrl, "favorited");
				// remove favorite gif
			} else {
				this.Store.activeUser_Firebase.favoritedGifs.splice(this.Store.activeUser_Firebase.favoritedGifs.indexOf(gifUrl), 1);
				this.messages.forEach((message: any) => {
					if (this.Store.activeUser_Firebase.favoritedGifs.includes(message.url)) {
						this.messages[this.messages.indexOf(message)].heart = "assets/heart.png";
					} else {
						this.messages[this.messages.indexOf(message)].heart = "assets/heartOutline.png";
					}
            });
            this.firebase.updateUser(this.Store.activeUser_Firebase.uid, gifUrl, "unFavorited");
         }

         
         
         setTimeout(() => {
            this.favoriteAllowed = true;
         }, this.favoriteCooldown);
		}
	}

	ngAfterViewInit(): void {
		this.getMessages();
		this.firebase.subscribeToChat(this.Store.activeChat, () => {
			console.log("Snapshot!!");
			this.getMessages();
		});

		this.checkForScroll();

		this.scrollCheckInt = setInterval(() => {
			this.checkForScroll();
		}, 500);
   }
   
   loadMoreMessages() {
      this.offset += this.messagesToRecieve;
      this.messages = this.allMessages.slice(this.allMessages.length - this.messagesToRecieve - this.offset);
      this.sortMessages();
   }

	getMessages() {
		this.firebase.getChat("test-chat", (data: any) => {
         this.allMessages = data;
         this.messages = data.slice(data.length - this.messagesToRecieve - this.offset, data.length - this.offset);
         this.sortMessages();
		});
   }
   
   sortMessages() {
      this.messages.forEach((message: any) => {
         // sent vs recieved text correction
         if (message.user == this.Store.activeUser_Google.uid) {
            this.messages[this.messages.indexOf(message)].type = "sent";
            this.messages[this.messages.indexOf(message)].senderName = "you";
         } else {
            this.messages[this.messages.indexOf(message)].type = "";
         }
         // favorited
         if (this.Store.activeUser_Firebase.favoritedGifs.includes(message.url)) {
            this.messages[this.messages.indexOf(message)].heart = "assets/heart.png";
         } else {
            this.messages[this.messages.indexOf(message)].heart = "assets/heartOutline.png";
         }
         // timestamp
         this.messages[this.messages.indexOf(message)].time = this.getTime(message.timestamp);
      });
   }

	scrollToBottom() {
		this.messageWrapper.nativeElement.scroll({
			top: this.messageWrapper.nativeElement.scrollHeight * 2,
			left: 0,
			behavior: "smooth",
		});
		this.scrolled = true;
		clearInterval(this.scrollCheckInt);
		setTimeout(() => {
			this.scrollCheckInt = setInterval(() => {
				this.checkForScroll();
			}, 500);
		}, 1000);
	}

	checkForScroll() {
		if (
			this.messageWrapper.nativeElement.scrollTop <
			this.messageWrapper.nativeElement.scrollHeight - this.messageWrapper.nativeElement.offsetHeight - this.scrollAllowance
		) {
			this.scrolled = false;
		}
	}

	loadMore() {
		this.offset += this.retrieveCount;
		this.getSearch(this.offset);
	}

	// return more useful relative timestamp
	getTime(date: any) {
		var seconds = Math.floor((Date.now() - date) / 1000);
		var interval = seconds / 31536000;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " year ago" : " years ago");
		}
		interval = seconds / 2592000;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " month ago" : " months ago");
		}
		interval = seconds / 86400;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " day ago" : " days ago");
		}
		interval = seconds / 3600;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " hour ago" : " hours ago");
		}
		interval = seconds / 60;
		if (interval > 1) {
			return Math.floor(interval) + (Math.floor(interval) == 1 ? " minute ago" : " minutes ago");
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

   openFavorites() {
      this.choosingFavorite = !this.choosingFavorite;
      this.closeGifPicker();
   }

   closeFavorites() {
      this.choosingFavorite = false;
   }

   async getSearch(startAt: any = 0) {
      this.closeFavorites();
		// cached data
		if (this.cache && localStorage.getItem("gif-cache")) {
			let parsedData = JSON.parse(localStorage.getItem("gif-cache") || "");
			parsedData.data.forEach((gif: any) => {
				this.searchResult.push(gif);
			});
			this.retrieved = true;
			return;
		}
		// giphy data
		this.Giphy.getSearch(this.searchTerm, startAt, this.retrieveCount).then(
			(data) => {
				data.data.forEach((gif: any) => {
					this.searchResult.push(gif);
				});
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
