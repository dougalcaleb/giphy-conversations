import {Injectable} from "@angular/core";
import {User} from "../models/user";
import {Router} from "@angular/router";
// firebase
import firebase from "firebase/app";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
// rxjs
import {Observable, of} from "rxjs";
import {defaultIfEmpty, map, mergeMap, switchMap, take, tap} from "rxjs/operators";
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

      if (sessionStorage.getItem("GC_loggedInUser_Google")) {
         this.Store.activeUser_Google = JSON.parse(sessionStorage.getItem("GC_loggedInUser_Google") || "null");
         this.Store.activeUser_Firebase = JSON.parse(sessionStorage.getItem("GC_loggedInUser_Firebase") || "null");
         this.Store.loggedIn = true;
         this.setUserData(this.Store.activeUser_Firebase);
      } else {
         this.Store.activeUser_Firebase = StoreService.defaultFirebaseUser;
      }


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
      
      userRef.get().pipe(
         take(1),
         map((item: any) => {
            let userData = item.data();

            const data = {
               uid: userData?.uid || user.uid,
               email: userData?.email || user.email,
               displayName: userData?.displayName || user.displayName,
               photoURL: userData?.photoURL || user.photoURL,
               color: userData?.color || "orange",
               chats: userData?.chats || [],
               username: userData?.username || user.displayName.split(" ").join("") + "-" + uuidv4().split("").slice(0,5).join(""),
               favoritedGifs: userData?.favoritedGifs || [],
            };
            
            this.userData = data;
            this.Store.activeUser_Firebase = data;
            this.Store.saveUser();
            
            if (item.data() == undefined) {
               this.Store.isNewUser = true;
            }
      
            return userRef.set(data, {merge: true});

         }),
      ).subscribe();
   }
   
   //! UNFINISHED, NEEDS VALIDATION sets a user's username
   async setNewUsername(newName: any) {
      this.searchUser(newName, (returnVal: any) => {
         if (returnVal != null) {
            alert("Username is taken");
         }
      }, "username");
   }

   // edits user data
   updateUser(userId: string, newData: any, type: string) {
      console.log(`Updating user with action type ${type}`);
      switch (type) {
         case "newChat":
            this.firestore.doc(`users/${userId}`).update({
               chats: firebase.firestore.FieldValue.arrayUnion(newData)
            });
            break;
         case "favorited":
            this.firestore.doc(`users/${userId}`).update({
               favoritedGifs: firebase.firestore.FieldValue.arrayUnion(newData)
            });
            break;
         case "unFavorited":
            this.firestore.doc(`users/${userId}`).update({
               favoritedGifs: firebase.firestore.FieldValue.arrayRemove(newData)
            });
            break;
      }
   }

	// Signs out and routes to login
	async signOut() {
		await this.auth.signOut();
		this.Store.activeUser_Google = null;
		this.Store.activeUser_Firebase = StoreService.defaultFirebaseUser;
		this.Store.loggedIn = false;
		this.router.navigate(["/"]);
	}

   // check if a user with a given piece of data exists
   public async searchUser(searchTerm: string, callback: any, searchFor: any = "username"): Promise<any> {
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
   
   //! unfinished, needs validation and chats-meta creation
   public createChat(uid: any) {
      const emptyData = { messages: [] };
      this.firestore.doc(`chats/${uid}`).set(emptyData);
   }

   // get all messages from a chat. called from conversation
   public getChat(uid: any, callback: any) {
      this.Store.activeChat = uid;
      this.firestore.doc(`chats/${uid}`).get().pipe(
         tap((item: any) => {
            callback(item.data().messages);
         })
      ).subscribe();
   }

   // loads simple chat data for the list of chats page
   public loadUserChats(loadChats: any = [], finished = false) {
      if (finished) {
         return;
      }
      if (loadChats.length == 0) {
         loadChats = this.Store.activeUser_Firebase.chats.slice();
      }
      console.log("Will load:");
      console.log(loadChats);
      console.log(this.Store.activeUser_Firebase.chats);
      this.firestore.doc(`chats-meta/${loadChats[0]}`).get().pipe(
         // take(1),
         tap((item: any) => {
            console.log("Got")
            this.Store.chats.push(item.data());
            loadChats.shift();
            if (loadChats.length == 0) {
               finished = true;
            }
            this.loadUserChats(loadChats, finished);
         })
      ).subscribe();
   }

   // post a new message to Firebase
   public sendMessage(text: any, callback: any) {
      console.log("active username: ", this.Store.activeUser_Firebase?.username);
      // prepare message data
      let message = {
         senderName: this.Store.activeUser_Firebase?.username,
         senderPhotoURL: this.Store.activeUser_Google.photoURL,
         url: text,
         user: this.Store.activeUser_Google.uid,
         timestamp: Date.now(),
      }
      // add message to message list
      this.firestore.doc(`chats/${this.Store.activeChat}`).update({
         messages: firebase.firestore.FieldValue.arrayUnion(message)
      }).then(() => {
         callback();
      });
      // update chat meta
      this.firestore.doc(`chats-meta/${this.Store.activeChat}`).set({
         last: {
            from: this.Store.activeUser_Firebase.username,
            timestamp: Date.now(),
            url: text
         }
      }, { merge: true });
   }

   // listen for new messages from a chat
   public subscribeToChat(uid: string, callback: any) {
      this.firestore.collection("chats").doc(uid).valueChanges().subscribe(() => {
         callback();
      })
   }
}
