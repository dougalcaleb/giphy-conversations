import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  constructor(public Store: StoreService, private Firebase: FirebaseService, private router: Router) { }

   ngOnInit(): void {
      this.Firebase.loadUserChats();
   }
   
   selectChat(uid: any) {
      this.Store.activeChat = uid;
      this.router.navigate(["/conversation"]);
   }

   // return more useful relative timestamp
	getTime(date: any) {
		var seconds = Math.floor((Date.now() - date) / 1000);
		var interval = seconds / 31536000;
      if (interval > 1) {
         if (Math.floor(interval) > 5) {
            return "a very long time ago"
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

}
