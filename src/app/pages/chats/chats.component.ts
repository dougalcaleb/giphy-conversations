import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoreService } from 'src/app/services/store.service';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

   // searchThrottle = 500;

   userSearchTerm: any = "";
   inProgressUsers: any = [];
   inProgressUsersUIDs: any = [];
   suggested: User[] = [];
   // inProgress = true;
   startingChat = false;

  constructor(public Store: StoreService, private Firebase: FirebaseService, private router: Router) { }

   ngOnInit(): void {
      this.Firebase.loadUserChats();
      // console.log(this.Store.chatsMeta);
   }
   
   selectChat(uid: any) {
      this.Store.activeChat = uid;
      this.router.navigate(["/conversation"]);
   }

   removeFromChat(chatId: any) {
      this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, chatId, "removeChat");
      this.Firebase.removeFromChat(chatId);
   }

   // cancel the new chat
   cancelNewChat() {
      this.suggested = [];
      this.userSearchTerm = "";
      this.inProgressUsers = [];
      this.inProgressUsersUIDs = [];
      this.startingChat = false;
   }

   // open the modal to start a new chat
   startNewChat() {
      this.startingChat = true;
   }
   
   // remove the suggested users
   clearSuggested() {
      this.suggested = [];
		this.userSearchTerm = "";
   }

   // handle search start
   handleKey(event: any) {
      if (event.key == "Enter") {
			this.search();
			// event.target.value = "";
		}
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
   finishNewChat() {
      let chatId = uuidv4();
      this.Firebase.createChat(chatId, this.inProgressUsers);
      this.inProgressUsers.forEach((user:any) => {
         this.Firebase.updateUser(user.uid, chatId, "newChat");
      });
      this.Firebase.updateUser(this.Store.activeUser_Google.uid, chatId, "newChat");
      this.cancelNewChat();
      // could be better
      setTimeout(() => {
         this.Firebase.loadUserChats();
      }, 1000);
   }

   // search firebase users for a matching username
   search() {
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
