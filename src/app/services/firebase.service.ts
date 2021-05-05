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
import {map, switchMap, take, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import { ChatMeta } from "../interfaces/chat-meta";
import { stringify } from "@angular/compiler/src/util";

@Injectable({
	providedIn: "root",
})
export class FirebaseService {
	signedIn: Observable<FirebaseUser | null | undefined>;

	constructor(public firestore: AngularFirestore, public auth: AngularFireAuth, private router: Router, private Store: StoreService) {
		// Retrieve user from session storage (if exists) to prevent having to login again on refresh
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
	async googleSignIn(): Promise<void> {
      const provider = new firebase.auth.GoogleAuthProvider();
      let cred: any;
      let sud: any = null;
      try {
         cred = await this.auth.signInWithPopup(provider);
         this.Store.activeUser_Google = cred.user;
         this.Store.loggedIn = true;
         sud = this.setUserData(cred.user);
      } catch (error) {
         if (error.code == "auth/popup-closed-by-user") {
            console.warn("Popup closed");
         }
      }
      return sud;
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
	private async setUserData(user: any): Promise<void> {
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

	/*
   ?==========================================================================================================
   ?
   ?   Chat management
   ?
   ?==========================================================================================================
   */

	// Loads the chat metadata as well as all users that are part of the chat
	public async loadActiveChatData(callback: Function) {
		this.firestore
			.doc(`chats-meta/${this.Store.activeChatId}`)
			.get()
			.pipe(
				take(1),
				tap((doc: any) => {
					this.Store.activeChatMeta = doc.data();
					console.log(`Got active chat meta from id ${this.Store.activeChatId}:`);
					console.log(this.Store.activeChatMeta);
					this.Store.activeChatMeta.members.forEach((memberId: any, index: number) => {
						//! Will need to be updated when shifting from old member object to simply uids
						this.firestore
							.doc(`users/${memberId}`)
							.get()
							.pipe(
								tap((user: any) => {
									this.Store.activeChat_Members.push(user.data());
									if (index == this.Store.activeChatMeta.members.length - 1) {
										callback();
									}
								})
							)
							.subscribe();
					});
				})
			)
			.subscribe();
	}

	// Loads all chat data needed for the chatlist page
	public async loadSelectableChats() {
		this.Store.activeUser_Firebase.chats.forEach((chatId: string) => {
			this.firestore
				.doc(`chats/${chatId}`)
				.get()
				.pipe(
					tap((doc: any) => {
						this.Store.allChatsMeta.push(doc.data());
					})
				)
				.subscribe();
		});
   }
   
   // Creates a new chat and the corresponding metadata
   public async createNewChat(users: FirebaseUser[], name: string, callback: Function) {
      let chatId = uuidv4();
      let newChatData = { messages: [] };
      let newChatMetaData:ChatMeta = {
         last: {
            from: "",
            timestamp: 0,
            url: "",
         },
         members: users.map((user: FirebaseUser) => {
            return user.uid;
         }),
         name: name,
         uid: chatId
      }
      // create chat
      this.firestore.doc(`chats/${chatId}`).set(newChatData).then(() => {
         // create chat meta
         this.firestore.doc(`chats-meta/${chatId}`).set(newChatMetaData).then(() => {
            // include all users and tell chatlist the data is ready enough to be used
            users.forEach((user: FirebaseUser) => {
               this.firestore.doc(`users/${user.uid}`).update({
                  chats: firebase.firestore.FieldValue.arrayUnion(chatId)
               });
            });
            this.firestore.doc(`users/${this.Store.activeUser_Firebase.uid}`).update({
               chats: firebase.firestore.FieldValue.arrayUnion(chatId)
            });
            callback(chatId);
         });
      });
   }

   // delete a chat and remove the reference from all users
   public async deleteChat(chatId: string = this.Store.activeChatId) {
      let affectedUsers: string[] = [];
      this.firestore.doc(`chats-meta/${chatId}`).get().pipe(
         tap((doc: any) => {
            affectedUsers = doc.data().members;
            affectedUsers.forEach((user: string) => {
               this.firestore.doc(`users/${user}`).update({
                  chats: firebase.firestore.FieldValue.arrayRemove(chatId)
               });
            });
            this.firestore.doc(`chats-meta/${chatId}`).delete();
         })
      ).subscribe();
      this.firestore.doc(`chats/${chatId}`).delete();
   }

	/*
   ?==========================================================================================================
   ?
   ?   User fetching
   ?
   ?==========================================================================================================
   */

	// Gets a single user data object by user UID
	public async fetchSingleUserByUid(uid: string, callback: Function) {
		this.firestore
			.doc(`users/${uid}`)
			.get()
			.pipe(
				take(1),
				tap((user: any) => {
					callback(user.data());
				})
			)
			.subscribe();
	}

	// Gets all users that have a username that contains the search term
	public async fetchUsersByUsername(searchTerm: string, callback: Function, filterSelf: boolean = true) {
		this.firestore
			.collection("users")
			.get()
			.pipe(
				take(1),
				tap((users: any) => {
					let allUsers: FirebaseUser[] = [];
					let matchingUsers: FirebaseUser[] = [];
					let reg = new RegExp(searchTerm, "i");

					users.docs.map((doc: any) => {
						allUsers.push(doc.data());
					});

					allUsers.forEach((user: FirebaseUser) => {
						if (user.username.match(reg)) {
							if (filterSelf && user.uid != this.Store.activeUser_Firebase.uid) {
								matchingUsers.push(user);
							} else if (!filterSelf) {
								matchingUsers.push(user);
							}
						}
					});
					callback(matchingUsers);
				})
			)
			.subscribe();
	}
}
