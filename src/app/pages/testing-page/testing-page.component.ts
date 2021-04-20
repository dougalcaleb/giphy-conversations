import { Component, OnInit } from '@angular/core';
import { keys } from 'src/environments/keys';
import { GiphyService } from "../../services/giphy.service";

@Component({
  selector: 'app-testing-page',
  templateUrl: './testing-page.component.html',
  styleUrls: ['./testing-page.component.scss']
})
export class TestingPageComponent implements OnInit {
   searchUrl = "api.giphy.com/v1/gifs/search";
   trendingUrl = "api.giphy.com/v1/gifs/trending";
   req = new XMLHttpRequest();
   params = `?api_key=${keys.giphy}&limit=10&rating=pg-13`;

   constructor(private Giphy: GiphyService) { }
   
   ngOnInit() {}

   getData() {
      this.req.open("GET", "http://"+this.trendingUrl + this.params, true);
      this.req.responseType = "text";
      this.req.send();
      this.req.onload = () => {
         if (this.req.status == 200) {
            console.log(this.req.responseText);
         }
      }
  }
}
