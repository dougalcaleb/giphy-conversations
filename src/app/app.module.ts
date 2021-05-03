// general
import { NgModule } from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {keys} from "src/environments/keys";
// pages
import {LoginComponent} from "./pages/login/login.component";
import {ChatlistComponent} from "./pages/chatlist/chatlist.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import { ConversationComponent } from "./pages/conversation/conversation.component";
import {PagenotfoundComponent} from "./pages/pagenotfound/pagenotfound.component";
// components
import {HeaderComponent} from "./components/header/header.component";
import { MessageComponent } from "./components/message/message.component";
// angularfire
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {AngularFireAuthModule} from "@angular/fire/auth";
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		ChatlistComponent,
		ProfileComponent,
		ConversationComponent,
		HeaderComponent,
		MessageComponent,
		PagenotfoundComponent,
  ChatComponent,
	],
	imports: [BrowserModule, AppRoutingModule, AngularFireModule.initializeApp(keys.firebase), AngularFirestoreModule, AngularFireAuthModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
