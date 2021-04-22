import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
   public activeUser: any = null;
   public loggedIn: boolean = false;

  constructor() { }
}
