import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

   constructor(private Firebase: FirebaseService, private Store: StoreService) { }

  ngOnInit(): void {
  }

   async logout() {
      console.log("Signing out");
      await this.Firebase.signOut();
      this.Store.clearUserData();
   }
}
