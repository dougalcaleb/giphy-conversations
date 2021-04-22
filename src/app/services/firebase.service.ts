import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { Router } from "@angular/router";
// firebase
import firebase from "firebase/app";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
// rxjs
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
// other
import { StoreService } from "./store.service";


@Injectable({
	providedIn: "root",
})
export class FirebaseService {
   public signedIn: Observable<User | null | undefined>;
   public userData: any;

	constructor(public firestore: AngularFirestore, public auth: AngularFireAuth, private router: Router, private Store: StoreService) {
      this.signedIn = this.auth.authState.pipe(
         switchMap(user => {
            if (user) {
               return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
            } else {
               return of(null);
            }
         })
      )
   }
   
   // Google signin popup
   async googleSignIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      const cred = await this.auth.signInWithPopup(provider);
      this.userData = cred.user;
      return this.updateUserData(cred.user);
   }

   // Updates or sets user data in Firebase
   private updateUserData(user: any) {
      const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${user.uid}`);

      const data = {
         uid: user.uid,
         email: user.email,
         displayName: user.displayName,
         photoURL: user.photoURL,
         color: user.color || "orange",
         chats: user.chats || [],
      }

      return userRef.set(data, { merge: true });
   }

   // Signs out and routes to login
   async signOut() {
      await this.auth.signOut();
      this.Store.activeUser = null;
      this.Store.loggedIn = false;
      this.router.navigate(["/"]);
   }
}
