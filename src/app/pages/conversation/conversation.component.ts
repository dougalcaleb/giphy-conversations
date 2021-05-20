import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/interfaces/chat-message';
import { FirebaseUser } from 'src/app/interfaces/firebase-user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

   testGifUrl = "https://media2.giphy.com/media/5Zesu5VPNGJlm/giphy.mp4?cid=1480d408vbfhbmsl26vceb3rye86w82sawuesdo553sesoy0&rid=giphy.mp4&ct=g";
   testGifUrl2 = "https://media0.giphy.com/media/xUOxeTqiI5sgD1sXQI/giphy.mp4?cid=1480d4086v8urcr6fsyb3433kadpcai509b6jd5ezp37d4cv&rid=giphy.mp4&ct=g";

   testMessageSelf: ChatMessage = {
      senderName: "havoc",
      senderPhotoURL: "https://firebasestorage.googleapis.com/v0/b/giphy-conversations.appspot.com/o/profileImages%2Fx9bSzUSYsOMF6OjweJdaOc36rw72?alt=media&token=460ea4dd-cd7e-4a55-a034-f06e75bb5b99",
      senderUID: "x9bSzUSYsOMF6OjweJdaOc36rw72",
      url: this.testGifUrl,
      timestamp: 1621521028848
   }

   testMessageOther: ChatMessage = {
      senderName: "NotHavoc",
      senderPhotoURL: "https://lh3.googleusercontent.com/a-/AOh14GhbGpxxRCr8_GNhVh9HJg47fSVGKBaJdCCclNHv=s96-c",
      senderUID: "dwefiujnf98we7fwe97tfg",
      url: this.testGifUrl2,
      timestamp: 1621521028848
   }

  constructor(public Store: StoreService, private Firebase: FirebaseService) { }

  ngOnInit(): void {
  }

   openSettings() {

   }

}
