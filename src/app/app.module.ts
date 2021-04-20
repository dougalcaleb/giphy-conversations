import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from "./pages/login/login.component";
import {ChatListComponent} from "./pages/chat-list/chat-list.component";
import {ConversationComponent} from "./pages/conversation/conversation.component";
import {UserComponent} from "./pages/user/user.component";
import {MessageComponent} from "./components/message/message.component";
import {HeaderComponent} from "./components/header/header.component";
import {TestingPageComponent} from "./pages/testing-page/testing-page.component";

// Material
import {MatButtonModule} from "@angular/material/button";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		ChatListComponent,
		ConversationComponent,
		UserComponent,
		MessageComponent,
		HeaderComponent,
		TestingPageComponent,
	],
	imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MatButtonModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
