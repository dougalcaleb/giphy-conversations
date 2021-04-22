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
   constructor(private auth: FirebaseService, private router: Router,private Store: StoreService) { }
   
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot,): Observable<boolean> {
      return this.auth.signedIn.pipe(
         take(1),
         map(user => !!user),
         tap(loggedIn => {
            if (!loggedIn) {
               console.warn("Access denied");
               this.Store.loggedIn = false;
               this.router.navigate(["/login"]);
            }
         })
      )
	}
}
