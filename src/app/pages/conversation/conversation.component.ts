import {Component, OnInit} from "@angular/core";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-conversation",
	templateUrl: "./conversation.component.html",
	styleUrls: ["./conversation.component.scss"],
})
export class ConversationComponent implements OnInit {
	heart = "assets/heartOutline.png";
	messages: any = [
		{
			url: "https://media3.giphy.com/media/KpLPyE3D6HJPa/giphy.mp4?cid=1480d408mmg9n7yya1yopwn6jnrtj4cdlnx6ljglkkb2xslq&rid=giphy.mp4&ct=g",
			user: "t47FWrBXcrX0ks4KWyEmh5npnqJ3",
			type: ""
		},
	];

  constructor(private Store: StoreService) {
    this.messages.forEach((message:any) => {
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

	ngOnInit(): void {}
}
