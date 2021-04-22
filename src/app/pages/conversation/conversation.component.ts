import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  constructor(private store: StoreService) { }
  toggleModal() {
    if (this.store.display == false) {
      this.store.display = true;
    } else {
      this.store.display = false;
    }
  }
  

  ngOnInit(): void {
  }

}
