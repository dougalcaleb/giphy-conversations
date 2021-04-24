import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
   // User data
   public activeUser_Google: any = null;
   public activeUser_Firebase: User | null = null;
   // public activeUserName: any = null;
   // public favoritedGifs: any = [];
   public loggedIn: boolean = false;
   public activeChat: string = "";

   display = false;

  constructor() { }
}
