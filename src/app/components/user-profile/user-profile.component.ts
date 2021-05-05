import {Component, Input, OnInit} from "@angular/core";

@Component({
	selector: "app-user-profile",
	templateUrl: "./user-profile.component.html",
	styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
	@Input() photoURL: string = "";
   @Input() username: string = "";
   @Input() uid: string = "";
   @Input() userRemoval: boolean = false;
   @Input() interact = true;

   pointerStyle = "pointer";

	constructor() {
	}

   ngOnInit(): void {
      if (!this.interact) {
         this.pointerStyle = "default";
      }
   }
   
   removeUser() {}
}
