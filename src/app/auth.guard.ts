import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from "@angular/router";
import {Observable} from "rxjs";
import {tap, map, take} from "rxjs/operators";

import {FirebaseService} from "./services/firebase.service";
import { StoreService } from "./services/store.service";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
   constructor(private auth: FirebaseService, private router: Router, private Store: StoreService) { }
   
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot,): Observable<boolean> {
      return this.auth.signedIn.pipe(
         take(1),
         map(user => {
            if (!user && this.Store.isNewUser && this.Store.loggedIn) {
               return true;
            }
            return !!user;
         }),
         tap(loggedIn => {
            if ((!loggedIn && !this.Store.isNewUser) || !this.Store.loggedIn) {
               console.warn("Access denied", loggedIn, this.Store.loggedIn);
               this.Store.loggedIn = false;
               this.router.navigate(["/login"]);
            } else {
               console.log("Access granted");
               // this.router.navigate(["/chats"]);
            }
         })
      )
	}
}
