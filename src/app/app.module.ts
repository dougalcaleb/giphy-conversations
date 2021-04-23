// General
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {keys} from "src/environments/keys";

// Pages
import {LoginComponent} from "./pages/login/login.component";
import {ChatListComponent} from "./pages/chat-list/chat-list.component";
import {ConversationComponent} from "./pages/conversation/conversation.component";
import {UserComponent} from "./pages/user/user.component";
import {TestingPageComponent} from "./pages/testing-page/testing-page.component";

// Components
import {MessageComponent} from "./components/message/message.component";
import {HeaderComponent} from "./components/header/header.component";

// Material
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

// Firebase
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {TestChatlistComponent} from "./pages/test-chatlist/test-chatlist.component";
import { PagenotfoundComponent } from "./pages/pagenotfound/pagenotfound.component";
import { ChatsComponent } from './pages/chats/chats.component';
import { ChatComponent } from './components/chat/chat.component';


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
		TestChatlistComponent,
		PagenotfoundComponent,
  ChatsComponent,
  ChatComponent,
	],
	imports: [
		FormsModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		AngularFireModule.initializeApp(keys.firebase),
		AngularFirestoreModule,
		AngularFireAuthModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
