import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './frontoffice/home/home.component';
import { AboutComponent } from './frontoffice/about/about.component';
import { WorkComponent } from './frontoffice/work/work.component';
import { CategoryComponent } from './frontoffice/category/category.component';
import { NotFoundComponent } from './frontoffice/not-found/not-found.component';
import { DashboardComponent } from './backoffice/dashboard/dashboard.component';
import { DashboardContentComponent } from './backoffice/dashboard-content/dashboard-content.component';
import { StudyGroupComponent } from './frontoffice/study-group/study-group.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    WorkComponent,
    CategoryComponent,
    NotFoundComponent,
    DashboardComponent,
    DashboardContentComponent,
    StudyGroupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
