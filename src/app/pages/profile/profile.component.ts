import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

   unsavedChanges: boolean = false;
   showingEmail: boolean = false;
   username: string = "";

   showingImageModal: boolean = true;
   showingProgressBar: boolean = false;
   uploadComplete: boolean = false;

  constructor(public Store: StoreService, public Firebase: FirebaseService) { }

   ngOnInit(): void {
      this.username = this.Store.activeUser_Firebase.username + "";
   }
   
   showEmail() {
      this.showingEmail = true;
   }

   logout() {
      this.Store.clearSavedUser();
      this.Firebase.signOut();
   }

   openImageModal() {
      this.showingImageModal = true;
   }

   cancelNewImage() {
      this.showingImageModal = false;
   }

   closeNewImage() {
      this.showingImageModal = false;
   }

   confirmNewImage() {
      this.showingProgressBar = true;
      this.Firebase.uploadProfileImage(this.Store.newProfileImage, (imageURL:string) => {
         this.Firebase.updateUser(this.Store.activeUser_Firebase.uid, "newImage", imageURL);
         this.uploadComplete = true;
         setTimeout(() => {
            this.closeNewImage();
         }, 500);
      });
   }
   
   capture(event: any) {
      this.Store.newProfileImage = event.target.files[0];
      // console.log("image is");
      // console.log(event.target.files[0]);
   }

}
