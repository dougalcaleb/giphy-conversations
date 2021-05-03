import {Pipe, PipeTransform} from "@angular/core";
import { StoreService } from "../services/store.service";

@Pipe({
	name: "usersNotMe",
})
export class UsersNotMePipe implements PipeTransform {
   constructor(private Store: StoreService) {

   }
	transform(items: any[]): any {
      // if (!items || !filter) {
      //    return items;
      // }

      return items.filter(item => {
         return item.uid !== this.Store.activeUser_Firebase.uid;
      });
	}
}
