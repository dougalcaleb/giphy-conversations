import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  constructor(public Store: StoreService, private Firebase: FirebaseService) { }

  ngOnInit(): void {
  }

}
