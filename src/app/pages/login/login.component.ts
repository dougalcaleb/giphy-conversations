import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

   userEmail: string = "";
   userPassword: string = "";

   showingEap = false;

   constructor(public Store: StoreService, private Firebase: FirebaseService, private router: Router) { }
   
   ngOnInit() {
      if (this.Store.loggedIn) {
         this.router.navigate(["chatlist"])
      }
   }
   
   async signIn() {
      if (!this.Store.loggedIn) {
         await this.Firebase.googleSignIn();
         this.Store.saveUser();
         this.router.navigate(["chatlist"])
      } else {
         await this.Firebase.signOut();
      }
   }

   goHome() {
		this.router.navigate(["chatlist"]);
   }
   
   showEap() {
      this.showingEap = true;
   }


}
