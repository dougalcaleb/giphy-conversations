// general
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
// firebase
import firebase from "firebase/app";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
// helpers
import {StoreService} from "./store.service";
import {FirebaseUser} from "../interfaces/firebase-user";
import {v4 as uuidv4} from "uuid";
// rxjs
import {map, switchMap, take} from "rxjs/operators";
import {Observable, of} from "rxjs";

@Injectable({
	providedIn: "root",
})
export class FirebaseService {
   signedIn: Observable<FirebaseUser | null | undefined>;

	constructor(public firestore: AngularFirestore, public auth: AngularFireAuth, private router: Router, private Store: StoreService) {
		if (sessionStorage.getItem("GC_loggedInUser_Google")) {
			this.Store.activeUser_Google = JSON.parse(sessionStorage.getItem("GC_loggedInUser_Google") || "null");
			this.Store.activeUser_Firebase = JSON.parse(sessionStorage.getItem("GC_loggedInUser_Firebase") || "null");
			this.Store.loggedIn = true;
			this.setUserData(this.Store.activeUser_Firebase);
		} else {
			this.Store.activeUser_Firebase = StoreService.defaultUser_Firebase;
		}

		this.signedIn = this.auth.authState.pipe(
			switchMap((user) => {
				if (user) {
					return this.firestore.doc<FirebaseUser>(`users/${user.uid}`).valueChanges();
				} else {
					return of(null);
				}
			})
		);
   }
   
   /*
   ?==========================================================================================================
   ?
   ?   Sign in/out
   ?
   ?==========================================================================================================
   */

	// google signin popup
	async googleSignIn() {
		const provider = new firebase.auth.GoogleAuthProvider();
      const cred = await this.auth.signInWithPopup(provider);
      this.Store.activeUser_Google = cred.user;
		return this.setUserData(cred.user);
   }
   
   // sign out user
   async signOut() {
		await this.auth.signOut();
		this.Store.activeUser_Google = null;
		this.Store.activeUser_Firebase = StoreService.defaultUser_Firebase;
		this.Store.loggedIn = false;
		this.router.navigate(["/"]);
	}

	// updates or sets a user in Firebase
	private async setUserData(user: any) {
		const userRef = this.firestore.doc(`users/${user.uid}`);

		userRef
			.get()
			.pipe(
				take(1),
				map((item: any) => {
					let userData = item.data();

					// allows for getting existing Firebase user data, or filling out the required data from Google if they're new
					const data: FirebaseUser = {
						chats: userData?.chats || [],
						displayName: userData?.displayName || user.displayName,
						email: userData?.email || user.email,
						favoritedGifs: userData?.favoritedGifs || [],
						photoURL: userData?.photoURL || user.photoURL,
						uid: userData?.uid || user.uid,
						username: userData?.username || user.displayName.split(" ").join("") + "-" + uuidv4().split("").slice(0, 5).join(""),
						color: userData?.color || "#ffffff",
					};

					this.Store.activeUser_Firebase = data;
					this.Store.saveUser();

					if (item.data() == undefined) {
						this.Store.isNewUser = true;
					}

					return userRef.set(data, {merge: true});
				})
			)
			.subscribe();
   }
   

   /*
   ?==========================================================================================================
   ?
   ?   Group member management
   ?
   ?==========================================================================================================
   */
   
   // decide if ref or not

   public removeMemberFromGroup(chatId: string, userId: string = this.Store.activeUser_Firebase.uid) {
      /* this needs to:
      1. remove from user's chats
      2. remove from metadata
      3. update local store to match firebase (could either pull or adjust here and trust it's in sync)
      */
   }


}
