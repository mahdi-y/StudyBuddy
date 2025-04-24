import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './frontoffice/home/home.component';
import { AboutComponent } from './frontoffice/about/about.component';
import { WorkComponent } from './frontoffice/work/work.component';
import { CategoryComponent } from './frontoffice/category/category.component';
import { NotFoundComponent } from './frontoffice/not-found/not-found.component';
import { DashboardContentComponent } from './backoffice/dashboard-content/dashboard-content.component';
import { StudyGroupComponent } from './frontoffice/study-group/study-group.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { AuthGuard } from './services/auth.guard.service';
import { DashboardComponent} from "./backoffice/dashboard/dashboard.component";

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
    AppComponent,
    RegisterComponent,
    LoginComponent,
    BackofficeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
