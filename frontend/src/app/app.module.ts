import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router'; // Add Routes import
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { TaskComponent } from './task/task.component';
import { AddTaskComponent } from './task/add/add.component';
import { UpdateTaskComponent } from './task/update/update.component';
import { ProgressComponent } from './progress/progress.component'; // Import your new component (if you have one)



import { HomeComponent } from './frontoffice/home/home.component';
import { AboutComponent } from './frontoffice/about/about.component';
import { WorkComponent } from './frontoffice/work/work.component';
import { CategoryComponent } from './frontoffice/category/category.component';
import { NotFoundComponent } from './frontoffice/not-found/not-found.component';
import { DashboardContentComponent } from './backoffice/dashboard-content/dashboard-content.component';
import { StudyGroupComponent } from './frontoffice/study-group/study-group.component';
import {ChatComponent} from "./components/chat/chat.component";
import { ReportedMessagesComponent } from './backoffice/reported-messages/reported-messages.component';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { AuthGuard } from './services/auth.guard.service';
import { DashboardComponent} from "./backoffice/dashboard/dashboard.component";
import { StudyGroupListComponent} from "./study-groups/study-group-list/study-group-list.component";
import {StudyGroupCreateComponent} from "./study-groups/study-group-create/study-group-create.component";
import {StudyGroupUpdateComponent} from "./study-groups/study-group-update/study-group-update.component";
import {FlashcardComponent} from "./study-groups/flashcards/flashcards.component";
import { UnauthorizedComponent } from './frontoffice/unauthorized/unauthorized.component';
import { AiChatComponent } from './ai-chat/ai-chat.component';

@NgModule({
  declarations: [
    AppComponent, // Declare the AppComponent
    TaskComponent, AddTaskComponent, UpdateTaskComponent, ProgressComponent,
    HomeComponent,
    AboutComponent,
    WorkComponent,
    CategoryComponent,
    NotFoundComponent,
    DashboardComponent,
    DashboardContentComponent,
    RegisterComponent,
    LoginComponent,
    BackofficeComponent,
    StudyGroupListComponent,
    StudyGroupCreateComponent,
    StudyGroupUpdateComponent,
    FlashcardComponent,
    StudyGroupComponent,
    AiChatComponent,
    ChatComponent,
    ReportedMessagesComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
