// general
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// guards
import { AuthGuard } from './auth.guard';
// components
import { ChatlistComponent } from './pages/chatlist/chatlist.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { LoginComponent } from './pages/login/login.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
   { path: "conversation", component: ConversationComponent, canActivate: [AuthGuard] },
   { path: "chatlist", component: ChatlistComponent, canActivate: [AuthGuard] },
   { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
   { path: "login", component: LoginComponent },
   { path: "notfound", component: PagenotfoundComponent },
   { path: "", component: LoginComponent },
   { path: "**", redirectTo: "notfound", pathMatch: "full" }
];


//? no auth

// const routes: Routes = [
//    { path: "conversation", component: ConversationComponent },
//    { path: "chatlist", component: ChatlistComponent },
//    { path: "profile", component: ProfileComponent },
//    { path: "login", component: LoginComponent },
//    { path: "notfound", component: PagenotfoundComponent },
//    { path: "", component: LoginComponent },
//    { path: "**", redirectTo: "notfound", pathMatch: "full" }
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
