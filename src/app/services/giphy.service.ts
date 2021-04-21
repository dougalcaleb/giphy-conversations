import { Injectable } from '@angular/core';
import { keys } from 'src/environments/keys';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {

   searchUrl = "api.giphy.com/v1/gifs/search";
   trendingUrl = "api.giphy.com/v1/gifs/trending";
   req = new XMLHttpRequest();
   params = `?api_key=${keys.giphy}&limit=10&rating=pg-13`;

   constructor() { }
   
   public getTrending(): any {
      this.req.open("GET", "http://"+this.trendingUrl + this.params, true);
      this.req.responseType = "text";
      this.req.send();
      this.req.onload = () => {
         if (this.req.status == 200) {
            return this.req.responseText;
         }
         return null;
      }
   }

   public async getSearch(query: string): Promise<any> {
      this.req.open("GET", "http://"+this.searchUrl + this.params+"&q="+query, true);
      this.req.responseType = "text";
      this.req.send();

      return new Promise((resolve, reject) => {
         this.req.onload = () => {
            if (this.req.status == 200) {
               resolve(JSON.parse(this.req.responseText));
            } else {
               console.error("Error while fetching data.");
            }
         }
         this.req.onerror = () => {
            reject();
         }
      });
   }
}
