import {Injectable} from "@angular/core";
import {User} from "../models/user";
import {Router} from "@angular/router";
// firebase
import firebase from "firebase/app";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
// rxjs
import {Observable, of} from "rxjs";
import {defaultIfEmpty, mergeMap, switchMap, take, tap} from "rxjs/operators";
// other
import { StoreService } from "./store.service";
import { v4 as uuidv4 } from "uuid";

@Injectable({
	providedIn: "root",
})
export class FirebaseService {
	public signedIn: Observable<User | null | undefined>;
	public userData: any;

	constructor(public firestore: AngularFirestore, public auth: AngularFireAuth, private router: Router, private Store: StoreService) {
		this.signedIn = this.auth.authState.pipe(
			switchMap((user) => {
				if (user) {
					return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
				} else {
					return of(null);
				}
			})
		);
	}

	// Google signin popup
	async googleSignIn() {
		const provider = new firebase.auth.GoogleAuthProvider();
		const cred = await this.auth.signInWithPopup(provider);
		this.userData = cred.user;
		return this.setUserData(cred.user);
	}

	// Updates or sets user data in Firebase
	private async setUserData(user: any) {
		const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${user.uid}`);

		const data = {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL,
			color: user.color || "orange",
			chats: user.chats || [],
         username: user.username || user.displayName.split(" ").join("") + "-" + uuidv4().split("").slice(0,5).join(""),
         favoritedGifs: user.favoritedGifs || [],
      };
      
      this.userData = data;
      this.Store.activeUser_Firebase = data;

		return userRef.set(data, {merge: true});
   }
   
   async setNewUsername(newName: any) {
      this.searchUser(newName, (returnVal: any) => {
         if (returnVal != null) {
            alert("Username is taken");
         }
      }, "username");
   }

   updateUser(userId: string, newData: any, type: string) {
      switch (type) {
         case "newChat":
            this.firestore.doc(`users/${userId}`).update({
               chats: firebase.firestore.FieldValue.arrayUnion(newData)
            });
            break;
      }
   }

	// Signs out and routes to login
	async signOut() {
		await this.auth.signOut();
		this.Store.activeUser_Google = null;
		this.Store.activeUser_Firebase = null;
		this.Store.loggedIn = false;
		this.router.navigate(["/"]);
	}

   public async searchUser(searchTerm: string, callback: any, searchFor: any = "username"): Promise<any> {
      let result = null;
      let found = false;
      this.firestore
         .collection("users", (ref) => ref.where(searchFor, "==", searchTerm))
         .get()
         .pipe(
            take(1),
            tap((item: any) => {
               if (item.empty) {
                  callback(null);
               } else {
                  item.docs.forEach((doc: any) => {
                     callback(doc.data());
                  });
               }
            }),
			)
         .subscribe();
   }
   
   public createChat(uid: any) {
      const emptyData = { messages: [] };
      this.firestore.doc(`chats/${uid}`).set(emptyData);
   }

   public getChat(uid: any, callback: any) {
      this.Store.activeChat = uid;
      this.firestore.doc(`chats/${uid}`).get().pipe(
         tap((item: any) => {
            callback(item.data().messages);
         })
      ).subscribe();
   }

   public sendMessage(text: any, callback: any) {
      console.log("active username: ",this.Store.activeUser_Firebase?.username);
      let message = {
         senderName: this.Store.activeUser_Firebase?.username,
         senderPhotoURL: this.Store.activeUser_Google.photoURL,
         url: text,
         user: this.Store.activeUser_Google.uid,
         timestamp: Date.now(),
      }
      this.firestore.doc(`chats/${this.Store.activeChat}`).update({
         messages: firebase.firestore.FieldValue.arrayUnion(message)
      }).then(() => {
         callback();
      });
   }

   public subscribeToChat(uid: string, callback: any) {
      console.log("Subscribing to chat", uid);
      this.firestore.collection("chats").doc(uid).valueChanges().subscribe(() => {
         console.log("Maybe now??");
         callback();
      })
   }
}
