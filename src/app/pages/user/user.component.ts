import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  display = false;
  toggle() {
    if (this.display == false) {
      this.display = true;
    } else {
      this.display = false;
    }
  }

  constructor(public Store: StoreService) { }

  ngOnInit(): void {
  }
}
