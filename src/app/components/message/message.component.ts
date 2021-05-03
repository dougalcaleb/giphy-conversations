import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  heart = "../../../assets/heartOutline.png";
  heartToggle() {
    if (this.heart == "../../../assets/heartOutline.png") {
      this.heart = "../../../assets/heart.png"
    } else {
      this.heart = "../../../assets/heartOutline.png"
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
