import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ChatMessage} from "src/app/interfaces/chat-message";
import {FirebaseUser} from "src/app/interfaces/firebase-user";
import {FirebaseService} from "src/app/services/firebase.service";
import {StoreService} from "src/app/services/store.service";
import {trigger, state, style, animate, transition} from "@angular/animations";
import { GiphyService } from "src/app/services/giphy.service";

@Component({
	selector: "app-conversation",
	templateUrl: "./conversation.component.html",
	styleUrls: ["./conversation.component.scss"],
})
export class ConversationComponent implements AfterViewInit {
	@ViewChild("messageWrapper", {read: ElementRef}) public messageWrapper: any;
   
   stbBtnIsVisible = true;
   canShowStbBtn = true;
   retrievedGifs: any = [];
   searchQuery: string = "";
   searchOffset: number = 0;
   showingFavorites: boolean = false;

   // settings
   scrollAllowance: number = 200;
   cacheResults: boolean = false;
   gifRetrieveCount: number = 15;
   messagesRetrieveCount: number = 20;
   messagesOffset: number = 0;

   constructor(public Store: StoreService, private Firebase: FirebaseService, private Giphy: GiphyService) {}

	ngAfterViewInit(): void {
      this.messageWrapper.nativeElement.addEventListener("scroll", () => {
         if (
            this.messageWrapper.nativeElement.scrollTop <
            this.messageWrapper.nativeElement.scrollHeight - this.messageWrapper.nativeElement.offsetHeight - this.scrollAllowance &&
            this.canShowStbBtn
         ) {
            this.stbBtnIsVisible = true;
         }
         
         if (
            this.messageWrapper.nativeElement.scrollTop >
            this.messageWrapper.nativeElement.scrollHeight - this.messageWrapper.nativeElement.offsetHeight - this.scrollAllowance
         ) {
            this.stbBtnIsVisible = false;
         }
      });

      this.Firebase.subscribeToActiveChat(() => {
         this.Firebase.retrieveActiveChatMessages((messages: ChatMessage[]) => {
            this.Store.activeChatAllMessages = messages;
            this.Store.activeChatShownMessages = messages.slice(Math.max(messages.length - this.messagesRetrieveCount - this.messagesOffset, 0), messages.length - this.messagesOffset);
            this.scrollToBottom();
         });
      });
	}

	openSettings() {}

	scrollToBottom() {
		this.stbBtnIsVisible = false;
		this.messageWrapper.nativeElement.scroll({
			top: this.messageWrapper.nativeElement.scrollHeight,
			left: 0,
			behavior: "smooth",
      });
      this.canShowStbBtn = false;
      let scrollTimeout: any;
      this.messageWrapper.nativeElement.addEventListener("scroll", () => {
         clearTimeout(scrollTimeout);
         scrollTimeout = setTimeout(() => {
            this.canShowStbBtn = true;
         }, 100);
      });
   }

   searchGifs() {
      // console.log("Gif Searching")
      if (this.cacheResults && localStorage.getItem("gif-cache")) {
         // console.log("Found cached");
         this.retrievedGifs = JSON.parse(localStorage.getItem("gif-cache") || "");
      } else {
         // console.log("No cached found");
         this.Giphy.search(this.searchQuery, this.searchOffset, this.gifRetrieveCount).then((data) => {
            this.retrievedGifs = data.data;
            if (this.cacheResults) {
               localStorage.setItem("gif-cache", JSON.stringify(data.data));
            }
         });
      }
   }

   loadMoreGifs() {
      if (this.cacheResults && localStorage.getItem("gif-cache")) {
         this.retrievedGifs = this.retrievedGifs.concat(JSON.parse(localStorage.getItem("gif-cache") || ""));
      } else {
         this.searchOffset += this.gifRetrieveCount;
         this.Giphy.search(this.searchQuery, this.searchOffset, this.gifRetrieveCount).then((data) => {
            this.retrievedGifs = this.retrievedGifs.concat(data.data);
         });
      }
   }

   closeOpenPicker() {
      if (this.showingFavorites) {
         this.closeFavoriteGifs();
      } else if (this.retrievedGifs.length > 0) {
         this.closeGifPicker();
      }
   }
   
   closeGifPicker() {
      this.retrievedGifs = [];
   }

   closeFavoriteGifs() {
      this.showingFavorites = false;
   }

   handleInputKeydown(event: any) {
      if (event.key == "Enter") {
         this.searchGifs();
      }
   }

   sendGif(gifURL: string) {
      this.Firebase.sendMessage(gifURL);
      this.closeOpenPicker();
   }

   toggleFavorites() {
      this.showingFavorites = !this.showingFavorites;
      if (this.showingFavorites && this.retrievedGifs.length > 0) {
         this.closeGifPicker();
      }
   }

   removeFromFavorites(gifURL: string) {
      this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, "removeFromFavorites", gifURL)
   }
}
