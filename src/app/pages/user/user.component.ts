import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { StoreService } from 'src/app/services/store.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
    constructor(
        public Store: StoreService,
        private firebase: FirebaseService
    ) {}
    display = false;
    toggle() {
        if (this.display == false) {
            this.display = true;
        } else {
            this.display = false;
        }
    }

    updateInfo() {
        this.toggle();
        this.firebase.updateUser( this.Store.activeUser_Firebase, this.Store.activeUser_Firebase.color, 'changeColor' );
        this.firebase.updateUser( this.Store.activeUser_Firebase, this.Store.activeUser_Firebase.username, 'changeUsername' );
        this.firebase.updateUser( this.Store.activeUser_Firebase, this.Store.activeUser_Firebase.displayName, 'changeDisplayName' );
    }

    ngOnInit(): void {}
}
