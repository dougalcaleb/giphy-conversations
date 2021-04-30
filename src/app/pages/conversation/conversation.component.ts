import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {User} from "src/app/models/user";
import {FirebaseService} from "src/app/services/firebase.service";
import {GiphyService} from "src/app/services/giphy.service";
import {StoreService} from "src/app/services/store.service";
import {parse, v4 as uuidv4} from "uuid";

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
	editModalOpen = false;
	//modal
	userSearchTerm: any = "";
	inProgressUsers: any = [];
	inProgressUsersUIDs: any = [];
   suggested: User[] = [];
   removeProgressUsers: any = [];
   removeProgressUsersUIDs: any = [];

	// config
	cache = true;
	retrieveCount = 10;
	scrollAllowance = 500;
	favoriteCooldown = 1000;
	messagesToRecieve = 10;

	constructor(public Store: StoreService, private Firebase: FirebaseService, private Giphy: GiphyService) {
		this.messages.forEach((message: any) => {
			message.type = this.Store.activeUser_Google.uid == message.user ? "sent" : "";
		});
	}

	ngAfterViewInit(): void {
		this.getMessages();
		this.Firebase.subscribeToChat(this.Store.activeChat, () => {
			this.getMessages();
      });
      
      console.log(this.Store.chatsMeta);

		this.checkForScroll();

		this.scrollCheckInt = setInterval(() => {
			this.checkForScroll();
		}, 500);
	}

	// edit modal utilities

	openEditModal() {
		this.editModalOpen = true;
	}
	// cancel the chat edit
	cancelEditChat() {
		this.suggested = [];
		this.userSearchTerm = "";
		this.inProgressUsers = [];
      this.inProgressUsersUIDs = [];
      this.removeProgressUsers = [];
		this.removeProgressUsersUIDs = [];
		this.editModalOpen = false;
	}
	// remove the suggested users
	clearSuggested() {
		this.suggested = [];
		this.userSearchTerm = "";
	}
	// when clicked, add user to the selected users
	selectUser(uid: any) {
		this.suggested.forEach((user) => {
			if (
				user.uid == uid && // looping user is the selected user
				!this.inProgressUsersUIDs.includes(user.uid) && // has not been selected already
				user.uid != "ERROR" && // is not the error message
				user.uid != this.Store.activeUser_Google.uid // is not self
			) {
				this.inProgressUsers.push(user);
				this.inProgressUsersUIDs.push(user.uid);
				this.clearSuggested();
			}
		});
	}
	// add new chat to firebase
	confirmEditChat() {
		// let chatId = uuidv4();
		// this.Firebase.createChat(chatId, this.inProgressUsers);
		// this.inProgressUsers.forEach((user: any) => {
		// 	this.Firebase.updateUser(user.uid, chatId, "newChat");
		// });
		// this.Firebase.updateUser(this.Store.activeUser_Google.uid, chatId, "newChat");
		// this.cancelEditChat();
		// // could be better
		// setTimeout(() => {
		// 	this.Firebase.loadUserChats();
		// }, 1000);
      console.log("About to remove all progress users. Outputting IDs, then users:");
      console.log(this.removeProgressUsersUIDs);
      console.log(this.removeProgressUsers);
      this.removeProgressUsersUIDs.forEach((userId: any) => {
         this.Firebase.updateUser(userId, this.Store.activeChat, "removeChat");
      });
      this.removeProgressUsers.forEach((user: any) => {
         this.Firebase.removeFromChat(this.Store.activeChat, user);
      });

      console.log("About to add new users. Outputting IDs, then users:");
      console.log(this.inProgressUsersUIDs);
      console.log(this.inProgressUsers);
      this.inProgressUsers.forEach((user: any) => {
         this.Firebase.getUserById(user.uid, (userdata: any) => {
            this.Firebase.updateUser(user.uid, this.Store.activeChat, "addOtherToChat", userdata);
         })
      });
      
      this.cancelEditChat();
	}
	// handle search start
	handleKey(event: any) {
		if (event.key == "Enter") {
			this.searchUsers();
			// event.target.value = "";
		}
   }

   // search firebase users for a matching username
   searchUsers() {
		this.suggested = [];
		let st = this.userSearchTerm;
		if (this.userSearchTerm.split("")[0] == "@") {
			st = this.userSearchTerm.split("").slice(1).join("");
			// console.log(`Adjusted search term to '${st}'`);
		}
		this.Firebase.searchUser(st, (data: any) => {
         if (data.length == 0) {
            this.suggested.push({
               uid: "ERROR",
               photoURL: "assets/error.png",
               username: "",
               displayName: "No matching users."
            } as User)
         } else {
            // console.log("POGGERS");
            console.log(data);
				this.suggested = data;
			}
		});
   }
   
   removeFromChat(userId: any) {
      // this.Firebase.updateUser(userId, this.Store.activeChat, "removeChat");
      // let userToRemove: any;
      console.log("Adding user to removal array. Id:", userId);
      for (let a = 0; a < this.Store.activeChatMeta.members.length; a++) {
         if (this.Store.activeChatMeta.members[a].uid == userId) {
            this.removeProgressUsers.push(this.Store.activeChatMeta.members[a]);
            this.removeProgressUsersUIDs.push(this.Store.activeChatMeta.members[a].uid);
            console.log("Found 'em");
         }
      }
      // this.Firebase.removeFromChat(this.Store.activeChat, userToRemove);
   }


	// favorite and unfavorite gifs
	heartToggle(gifUrl: any) {
		if (this.favoriteAllowed) {
			// helps prevent firebase input spam
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
				this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, gifUrl, "favorited");
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
				this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, gifUrl, "unFavorited");
			}

			setTimeout(() => {
				this.favoriteAllowed = true;
			}, this.favoriteCooldown);
		}
	}

	// loads additional gifs on click
	loadMoreMessages() {
		this.offset += this.messagesToRecieve;
		this.messages = this.allMessages.slice(this.allMessages.length - this.messagesToRecieve - this.offset);
		this.sortMessages();
	}

	// initial load
   getMessages() {
		this.Firebase.getChat(this.Store.activeChat, (data: any) => {
         this.allMessages = data;
         this.messages = data.slice(Math.max(data.length - this.messagesToRecieve - this.offset, 0), data.length - this.offset);
         this.sortMessages();
		});
	}

	// takes raw message data and assigns them to who sent them, indicates if they are favorited, and makes timestamp useful
	sortMessages() {
		this.messages.forEach((message: any) => {
			// sent vs recieved text vs notif correction
			if (message.user == this.Store.activeUser_Google.uid) {
				this.messages[this.messages.indexOf(message)].type = "sent";
				this.messages[this.messages.indexOf(message)].senderName = "you";
			} else if (message.senderName == "GIPHY_CONVERSATIONS_NOTIFICATIONS") {
				this.messages[this.messages.indexOf(message)].type = "notification";
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
      this.scrollToBottom();
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

	// checks to see if scrolltobottom button should enable
	checkForScroll() {
		if (
			this.messageWrapper.nativeElement.scrollTop <
			this.messageWrapper.nativeElement.scrollHeight - this.messageWrapper.nativeElement.offsetHeight - this.scrollAllowance
		) {
			this.scrolled = false;
		}
	}

	// load more gifs in gif picker
	loadMore() {
		this.offset += this.retrieveCount;
		this.getSearch(this.offset);
	}

	// return more useful relative timestamp
	getTime(date: any) {
		var seconds = Math.floor((Date.now() - date) / 1000);
		var interval = seconds / 31536000;
		if (interval > 1) {
			if (Math.floor(interval) > 5) {
				return "a very long time ago";
			}
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

	// start search event
	search(event: any) {
		if (event.key == "Enter") {
			this.getSearch();
		}
	}

	// trending gifs. for testing
	getTrendingData() {
		this.Giphy.getTrending();
	}

	// select and send a gif on click
	selectGif(url: any) {
		this.Firebase.sendMessage(url, () => {
			this.getMessages();
			this.closeGifPicker();
		});
	}

	// gif picker events

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

	// either retrieve cache data or data from Giphy
	async getSearch(startAt: any = 0) {
		this.closeFavorites();
		// cached data
      if (this.cache && localStorage.getItem("gif-cache")) {
         let parsedData = JSON.parse(localStorage.getItem("gif-cache") || "");
			parsedData.forEach((gif: any) => {
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
