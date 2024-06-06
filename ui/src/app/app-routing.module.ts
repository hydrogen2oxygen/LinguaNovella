import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {ReadComponent} from "./components/read/read.component";

const routes: Routes = [
  {path: '', redirectTo: 'READ', pathMatch: 'full'},
  {path: 'READ', component: ReadComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
