import {Component, OnInit} from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { GiphyService } from "../../services/giphy.service";

@Component({
	selector: "app-testing-page",
	templateUrl: "./testing-page.component.html",
	styleUrls: ["./testing-page.component.scss"],
})
export class TestingPageComponent implements OnInit {
	searchTerm = "";
   searchResult: any;
   retrieved = false;
   cache = true;

	constructor(private Giphy: GiphyService, public Firebase: FirebaseService) {}

   ngOnInit() { }
   
   async login() {

   }

	search(event: any) {
		if (event.key == "Enter") {
			console.log(this.searchTerm);
			this.getSearch();
		}
	}

	getTrendingData() {
		this.Giphy.getTrending();
	}

   async getSearch() {
      if (this.cache && localStorage.getItem("gif-cache")) {
         this.searchResult = JSON.parse(localStorage.getItem("gif-cache") || "");
         this.retrieved = true;
         return;
      }
      console.log("Initializing Search with term",this.searchTerm);
      this.Giphy.getSearch(this.searchTerm, 0, 10).then(
         (data) => {
            console.log("Retrieval was successful. Outputting data:");
            console.log("Raw:");
            console.log(data);
            this.searchResult = data;
            this.retrieved = true;
            if (this.cache) {
               localStorage.setItem("gif-cache", JSON.stringify(this.searchResult));
            }
         },
         () => {
            console.error("Search failed.");
         }
      );
   }
}
