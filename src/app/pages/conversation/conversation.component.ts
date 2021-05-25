import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ChatMessage} from "src/app/interfaces/chat-message";
import {FirebaseUser} from "src/app/interfaces/firebase-user";
import {FirebaseService} from "src/app/services/firebase.service";
import {StoreService} from "src/app/services/store.service";
import {trigger, state, style, animate, transition} from "@angular/animations";

@Component({
	selector: "app-conversation",
	templateUrl: "./conversation.component.html",
	styleUrls: ["./conversation.component.scss"],
	animations: [
		trigger("stbVisible", [
			state(
				"visible",
				style({
					opacity: "1",
					bottom: "max(calc(5vh + 20px), 70px);",
				})
			),
			state(
				"hidden",
				style({
					opacity: "0",
					bottom: "max(calc(5vh + 40px), 90px);",
				})
			),
			transition("visible => hidden", [animate("0.1s")]),
			transition("hidden => visible", [animate("0.1s")]),
		]),
	],
})
export class ConversationComponent implements AfterViewInit {
	@ViewChild("messageWrapper", {read: ElementRef}) public messageWrapper: any;

	testGifUrl = "https://media2.giphy.com/media/5Zesu5VPNGJlm/giphy.mp4?cid=1480d408vbfhbmsl26vceb3rye86w82sawuesdo553sesoy0&rid=giphy.mp4&ct=g";
	testGifUrl2 =
		"https://media0.giphy.com/media/xUOxeTqiI5sgD1sXQI/giphy.mp4?cid=1480d4086v8urcr6fsyb3433kadpcai509b6jd5ezp37d4cv&rid=giphy.mp4&ct=g";

	testMessageSelf: ChatMessage = {
		senderName: "havoc",
		senderPhotoURL:
			"https://firebasestorage.googleapis.com/v0/b/giphy-conversations.appspot.com/o/profileImages%2Fx9bSzUSYsOMF6OjweJdaOc36rw72?alt=media&token=460ea4dd-cd7e-4a55-a034-f06e75bb5b99",
		senderUID: "x9bSzUSYsOMF6OjweJdaOc36rw72",
		url: this.testGifUrl,
		timestamp: 1621521028848,
	};
   
	testMessageOther: ChatMessage = {
		senderName: "NotHavoc",
		senderPhotoURL: "https://lh3.googleusercontent.com/a-/AOh14GhbGpxxRCr8_GNhVh9HJg47fSVGKBaJdCCclNHv=s96-c",
		senderUID: "dwefiujnf98we7fwe97tfg",
		url: this.testGifUrl2,
		timestamp: 1621521028848,
   };
   
   stbBtnIsVisible = true;
   canShowStbBtn = true;
   retrievedGifs: any = [];

   // settings
   scrollAllowance: number = 200;
   cacheResults: boolean = true;

   constructor(public Store: StoreService, private Firebase: FirebaseService) {
      // this.retrievedGifs = JSON.parse(localStorage.getItem("gif-cache") || "");
   }

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
      if (this.cacheResults) {
         this.retrievedGifs = JSON.parse(localStorage.getItem("gif-cache") || "");
      }
   }

   loadMoreGifs() {
      if (this.cacheResults) {
         this.retrievedGifs = this.retrievedGifs.concat(JSON.parse(localStorage.getItem("gif-cache") || ""));
      }
      console.log(this.retrievedGifs);
   }
   
   closeGifPicker() {
      this.retrievedGifs = [];
   }

   handleInputKeydown(event: any) {
      if (event.key == "Enter") {
         this.searchGifs();
      }
   }
}
