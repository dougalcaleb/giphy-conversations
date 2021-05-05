import {Component, Input, OnInit} from "@angular/core";

@Component({
	selector: "app-spinner",
	templateUrl: "./spinner.component.html",
	styleUrls: ["./spinner.component.scss"],
})
export class SpinnerComponent implements OnInit {
	@Input() size: number = 50;
	sizeString: string = "50px";

	constructor() {}

	ngOnInit(): void {
		this.sizeString = this.size.toString() + "px";
	}
}
