import { Component, Input, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

   @Input() members: any[] = [];
   @Input() last: any = {
      from: "NONE",
      timestamp: 0,
      url: "NONE"
   };
   @Input() name: string = "NEW CHAT";
   @Input() uid: string = "NONE";
   

   constructor(public Store: StoreService) { }

  ngOnInit(): void {
  }

}