// general
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// guards
import { AuthGuard } from "./auth.guard";
// pages
import {LoginComponent} from "./pages/login/login.component";
import {TestingPageComponent} from "./pages/testing-page/testing-page.component";
import { ConversationComponent } from "./pages/conversation/conversation.component";
import { PagenotfoundComponent } from "./pages/pagenotfound/pagenotfound.component";
import { TestChatlistComponent } from "./pages/test-chatlist/test-chatlist.component";
import { ChatsComponent } from './pages/chats/chats.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
	{path: "test", component: TestingPageComponent, canActivate: [AuthGuard]},
	{path: "test-chatlist", component: TestChatlistComponent, canActivate: [AuthGuard]},
	{path: "conversation", component: ConversationComponent, canActivate: [AuthGuard]},
	{path: "chats", component: ChatsComponent, canActivate: [AuthGuard]},
	{path: "profile", component: UserComponent, canActivate: [AuthGuard]},
	{path: "login", component: LoginComponent},
	{path: "notfound", component: PagenotfoundComponent},
	{path: "**", redirectTo: "notfound", pathMatch: "full"},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
