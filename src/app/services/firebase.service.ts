// general
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
// firebase
import firebase from "firebase/app";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireStorage} from "@angular/fire/storage";
// helpers
import {StoreService} from "./store.service";
import {FirebaseUser} from "../interfaces/firebase-user";
import {v4 as uuidv4} from "uuid";
// rxjs
import {map, switchMap, take, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {ChatMeta} from "../interfaces/chat-meta";

@Injectable({
	providedIn: "root",
})
export class FirebaseService {
	signedIn: Observable<FirebaseUser | null | undefined>;
	public uploadProgress: any;

	constructor(
		public firestore: AngularFirestore,
		public storage: AngularFireStorage,
		public auth: AngularFireAuth,
		private router: Router,
		private Store: StoreService
	) {
		// Retrieve the user from session storage (if they exist there) to prevent having to login again on refresh
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

	// Google sign in popup
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

	// User sign out
	async signOut() {
		await this.auth.signOut();
		this.Store.activeUser_Google = null;
		this.Store.activeUser_Firebase = StoreService.defaultUser_Firebase;
		this.Store.loggedIn = false;
		this.router.navigate(["/"]);
	}

	// Called only from googleSignIn, updates or creates a Firebase user
	private async setUserData(user: any): Promise<void> {
		const userRef = this.firestore.doc(`users/${user.uid}`);

		userRef
			.get()
			.pipe(
				take(1),
				map((item: any) => {
					let userData = item.data();

					// merge existing and/or new data
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
   ?   User data management
   ?
   ?==========================================================================================================
   */

	public uploadProfileImage(image: any, callback: Function) {
      let task = this.storage.upload(`profileImages/${this.Store.activeUser_Firebase.uid}`, image);
		this.uploadProgress = task.snapshotChanges().pipe(
			map((s) => {
            let prog = ((s?.bytesTransferred || 0) / (s?.totalBytes || 100)) * 100;
            if (prog == 100) {
               callback(this.storage.ref(`profileImages/${this.Store.activeUser_Firebase.uid}`).getDownloadURL());
            }
				return prog;
			})
		);
   }
   
   public updateUser(userId: string, action: string, data: any, callback?: Function) {
      switch (action) {
         case "newImage":
            data.pipe(
               tap((data: any) => {
                  this.Store.activeUser_Firebase.photoURL = data;
                  this.firestore.doc(`users/${userId}`).set({photoURL: data as string}, {merge: true});
               })
            ).subscribe();
            break;
         case "username":
            this.Store.activeUser_Firebase.username = data as string;
            this.firestore.doc(`users/${userId}`).set({ username: data as string }, { merge: true });
            break;
      }
   }

	/*
   ?==========================================================================================================
   ?
   ?   Group member management
   ?
   ?==========================================================================================================
   */

	public removeMemberFromGroup(chatId: string, userId: string = this.Store.activeUser_Firebase.uid) {
		/* this needs to:
      1. remove chat from user's chats
      2. remove user from chat metadata
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

	// Loads the active chat metadata as well as all users that are part of the chat
	// Calls a callback on completion, passed no data
	public async loadActiveChatData(callback: Function) {
		this.firestore
			.doc(`chats-meta/${this.Store.activeChatId}`)
			.get()
			.pipe(
				take(1),
				tap((doc: any) => {
					this.Store.activeChatMeta = doc.data();
					// console.log(`Got active chat meta from id ${this.Store.activeChatId}:`);
					// console.log(this.Store.activeChatMeta);
					this.Store.activeChatMeta.members.forEach((memberId: any, index: number) => {
						this.firestore
							.doc(`users/${memberId}`)
							.get()
							.pipe(
								tap((user: any) => {
									this.Store.activeChatMembers.push(user.data());
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

	// Loads all chat data needed for the chatlist page. Makes use of fetchMultipleUsersByUid
	public async loadSelectableChats(callback: Function) {
		// keep track of how many chats are done loading
		let completed = 0;
		this.Store.activeUser_Firebase.chats.forEach((chatId: string, index: number) => {
			this.firestore
				.doc(`chats-meta/${chatId}`)
				.get()
				.pipe(
					tap((doc: any) => {
						// grab a chat metadata object
						let singleChatMembers: ChatMeta = doc.data();
						this.Store.allChatsMeta.push(singleChatMembers);
						// load all members associated with that chat
						this.fetchMultipleUsersByUid(singleChatMembers.members, (users: Array<FirebaseUser>) => {
							completed++;
							this.Store.allChatsMembers = this.Store.allChatsMembers.concat(users);
							// once all chats are done loading, return to chatlist.ts
							if (completed == this.Store.activeUser_Firebase.chats.length) {
								callback();
							}
						});
					})
				)
				.subscribe();
		});
	}

	// Creates a new chat, the corresponding metadata, and applies it to users
	public async createNewChat(users: FirebaseUser[], name: string, callback: Function) {
		let chatId = uuidv4();
		let newChatData = {messages: []};
		let newChatMetaData: ChatMeta = {
			last: {
				from: "",
				timestamp: 0,
				url: "",
			},
			members: users.map((user: FirebaseUser) => {
				return user.uid;
			}),
			name: name,
			uid: chatId,
		};
		// create chat
		this.firestore
			.doc(`chats/${chatId}`)
			.set(newChatData)
			.then(() => {
				// create chat meta
				this.firestore
					.doc(`chats-meta/${chatId}`)
					.set(newChatMetaData)
					.then(() => {
						// include all users and tell chatlist the data is ready enough to be used
						users.forEach((user: FirebaseUser) => {
							this.firestore.doc(`users/${user.uid}`).update({
								chats: firebase.firestore.FieldValue.arrayUnion(chatId),
							});
						});
						this.firestore.doc(`users/${this.Store.activeUser_Firebase.uid}`).update({
							chats: firebase.firestore.FieldValue.arrayUnion(chatId),
						});
						callback(chatId);
					});
			});
	}

	// Given a chat ID, deletes all data associated with that chat and removes it from users
	public async deleteChat(chatId: string = this.Store.activeChatId) {
		let affectedUsers: string[] = [];
		this.firestore
			.doc(`chats-meta/${chatId}`)
			.get()
			.pipe(
				tap((doc: any) => {
					affectedUsers = doc.data().members;
					affectedUsers.forEach((user: string) => {
						this.firestore.doc(`users/${user}`).update({
							chats: firebase.firestore.FieldValue.arrayRemove(chatId),
						});
					});
					this.firestore.doc(`chats-meta/${chatId}`).delete();
				})
			)
			.subscribe();
		this.firestore.doc(`chats/${chatId}`).delete();
	}

	/*
   ?==========================================================================================================
   ?
   ?   User fetching
   ?
   ?==========================================================================================================
   */

	// Given a single UID, calls a callback passed that user's Firebase data
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

	// Given one or more UIDs, calls a callback passed an array of users
	public async fetchMultipleUsersByUid(uids: Array<string>, callback: Function) {
		let data: Array<FirebaseUser> = [];
		console.log("Fetching multiple users:", uids);
		uids.forEach((userId: string, index: number) => {
			this.firestore
				.doc(`users/${userId}`)
				.get()
				.pipe(
					take(1),
					tap((user: any) => {
						console.log(`Got user index ${index}`);
						data.push(user.data());
						if (index == uids.length - 1) {
							console.log("Completed user fetch, calling back");
							callback(data);
						}
					})
				)
				.subscribe();
		});
	}

	// Given a search term, calls a callback passed an array of every user whose username contains the search term
	// Optionally returns current logged in user as well or, by default, does not
	public async fetchUsersByUsername(searchTerm: string, callback: Function, filterOutSelf: boolean = true) {
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
							if (filterOutSelf && user.uid != this.Store.activeUser_Firebase.uid) {
								matchingUsers.push(user);
							} else if (!filterOutSelf) {
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
