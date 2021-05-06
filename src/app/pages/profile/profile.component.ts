import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

   unsavedChanges: boolean = false;
   showingEmail: boolean = false;
   username: string = "";

  constructor(public Store: StoreService, private Firebase: FirebaseService) { }

   ngOnInit(): void {
      this.username = this.Store.activeUser_Firebase.username + "";
   }
   
   showEmail() {
      this.showingEmail = true;
   }

}
