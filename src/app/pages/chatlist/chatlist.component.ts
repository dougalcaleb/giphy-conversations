import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit {

   chats: any = [
      {
         name: "Chat 3.0",
         uid: "bruh1",
         last: {
            from: "soundhavoc",
            timestamp: 1620058076012,
            url: "https://media1.giphy.com/media/SxLSkF6D7Uec17J98V/giphy.mp4?cid=1480d408xns1qap565sm3q5bcturcwvx8yl6q31e59ncfrdm&rid=giphy.mp4&ct=g"
         },
         members: [
            {
               displayName: "Anders Rasmusson",
               username: "AndersRasmusson-2325243453453",
               photoURL: "https://lh3.googleusercontent.com/a-/AOh14GgT46aw0cSB3p42f8XcMQg0K2GfypgIF89nQ2EDVQ=s96-c",
               uid: "28w327oEPMRdw3GO9TYpdzJOJbo2"
            }
         ]
      },

      {
         name: "Chat 2",
         uid: "bruh",
         last: {
            from: "bruhboi",
            timestamp: 1620058074786,
            url: "https://media1.giphy.com/media/SxLSkF6D7Uec17J98V/giphy.mp4?cid=1480d408xns1qap565sm3q5bcturcwvx8yl6q31e59ncfrdm&rid=giphy.mp4&ct=g"
         },
         members: [
            {
               displayName: "Anders Rasmusson",
               username: "AndersRasmusson-2325243453453",
               photoURL: "https://lh3.googleusercontent.com/a-/AOh14GgT46aw0cSB3p42f8XcMQg0K2GfypgIF89nQ2EDVQ=s96-c",
               uid: "28w327oEPMRdw3GO9TYpdzJOJbo2"
            },
            {
               displayName: "Anders Rasmusson",
               username: "AndersRasmusson-2325243453453",
               photoURL: "https://lh3.googleusercontent.com/a-/AOh14GgT46aw0cSB3p42f8XcMQg0K2GfypgIF89nQ2EDVQ=s96-c",
               uid: "28w327oEPMRdw3GO9TYpdzJOJbo2"
            },
            {
               displayName: "Anders Rasmusson",
               username: "AndersRasmusson-2325243453453",
               photoURL: "https://lh3.googleusercontent.com/a-/AOh14GgT46aw0cSB3p42f8XcMQg0K2GfypgIF89nQ2EDVQ=s96-c",
               uid: "28w327oEPMRdw3GO9TYpdzJOJbo2"
            },
         ]
      }
   ]

  constructor(private Store: StoreService) { }

  ngOnInit(): void {
  }

}
