import {Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import {FirebaseService} from "src/app/services/firebase.service";
import { StoreService } from "src/app/services/store.service";
import { User } from "../../models/user";

// import { StoreService } from "src/app/app.module";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
	// public newUserData: any;
	// loggedIn = false;

   user: any = {
      u: "",
      p: "",
   }

   u: string = "";
   p: string = "";

	constructor(public Firebase: FirebaseService, public Store: StoreService, private router: Router) {}

   ngOnInit(): void {
      // if (this.Store.loggedIn) {
      //    this.loggedIn = true;
      // }
   }

   // Invokes Google popup signin (or signs out if already signed in), stores user data to global store
	async signIn() {
		if (!this.Store.loggedIn) {
			await this.Firebase.googleSignIn();
			// this.newUserData = this.Firebase.userData;
         this.Store.activeUser_Google = this.Firebase.userData;
         // this.loggedIn = true;
         this.Store.loggedIn = true;
         this.Store.saveUser();
         this.router.navigate(["chats"]);
      } else {
         console.log("Signing out");
         await this.Firebase.signOut();
         // this.loggedIn = false;
         this.Store.loggedIn = false;
      }
   }
   
   async eapSignIn() {
      if (!this.Store.loggedIn) {
         // console.log("signing in with");
         // console.log(`'${this.u.trim()}'`);
         // console.log(`'${this.p.trim()}'`);
         await this.Firebase.eapSignIn(this.u.trim(), this.p.trim());
      }
   }
}
