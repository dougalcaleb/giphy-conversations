import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
   // User data
   public activeUser: any = null;
   public activeUserName: any = null;
   public loggedIn: boolean = false;
   public activeChat: string = "";
   display = false;

  constructor() { }
}
