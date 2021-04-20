import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestingPageComponent } from './pages/testing-page/testing-page.component';

const routes: Routes = [
   {path: "test", component: TestingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
