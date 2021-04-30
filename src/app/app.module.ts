import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ChatlistComponent } from './pages/chatlist/chatlist.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { HeaderComponent } from './components/header/header.component';
import { MessageComponent } from './components/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatlistComponent,
    ProfileComponent,
    ConversationComponent,
    HeaderComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
