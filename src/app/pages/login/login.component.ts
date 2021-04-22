import {Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import {take, tap} from "rxjs/operators";
import {FirebaseService} from "src/app/services/firebase.service";
import { StoreService } from "src/app/services/store.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
	public newUserData: any;
	loggedIn = false;

	constructor(public Firebase: FirebaseService, private Store: StoreService, private router: Router) {}

	ngOnInit(): void {}

	async signIn() {
		if (!this.loggedIn) {
			await this.Firebase.googleSignIn();
			this.newUserData = this.Firebase.userData;
         this.loggedIn = true;
         this.Store.activeUser = this.newUserData;
         this.Store.loggedIn = true;
         this.router.navigate(["test"]);
			// console.log(this.newUserData);
      } else {
         await this.Firebase.signOut();
         this.loggedIn = false;
      }
	}
}
