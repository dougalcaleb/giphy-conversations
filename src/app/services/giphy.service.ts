import { Injectable } from '@angular/core';
import { keys } from 'src/environments/keys';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {

   searchUrl = "api.giphy.com/v1/gifs/search";
   trendingUrl = "api.giphy.com/v1/gifs/trending";
   req = new XMLHttpRequest();
   params = `?api_key=${keys.giphy}&rating=pg-13`;

   constructor() { }
   
   // Gets GIFs from the Trending section (testing purposes)
   public getTrending(): any {
      this.req.open("GET", "https://"+this.trendingUrl + this.params, true);
      this.req.responseType = "text";
      this.req.send();
      this.req.onload = () => {
         if (this.req.status == 200) {
            return this.req.responseText;
         }
         return null;
      }
   }

   // Gets GIFs from a search term
   public async getSearch(query: string, offset: number, count: number): Promise<any> {
      this.req.open("GET", `https://${this.searchUrl + this.params}&q=${query}&limit=${count}&offset=${offset}`, true);
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
