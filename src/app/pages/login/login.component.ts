import {Component, OnInit} from "@angular/core";
import {take, tap} from "rxjs/operators";
import {FirebaseService} from "src/app/services/firebase.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
	public newUserData: any;
	loggedIn = false;

	constructor(public Firebase: FirebaseService) {}

	ngOnInit(): void {}

	async signIn() {
		if (!this.loggedIn) {
			await this.Firebase.googleSignIn();
			this.newUserData = this.Firebase.userData;
			this.loggedIn = true;
			// console.log(this.newUserData);
      } else {
         await this.Firebase.signOut();
         this.loggedIn = false;
      }
	}
}
