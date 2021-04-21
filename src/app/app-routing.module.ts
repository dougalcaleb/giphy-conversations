// general
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// guards
import { AuthGuard } from "./auth.guard";
// pages
import {LoginComponent} from "./pages/login/login.component";
import {TestingPageComponent} from "./pages/testing-page/testing-page.component";
import { ConversationComponent } from "./pages/conversation/conversation.component";

const routes: Routes = [
	{path: "test", component: TestingPageComponent, canActivate: [AuthGuard]},
	{path: "conversation", component: ConversationComponent, canActivate: [AuthGuard]},
	{path: "login", component: LoginComponent},
	{path: "**", redirectTo: "login", pathMatch: "full"},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
