import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router'; // Add Routes import
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';



const routes: Routes = [
  { path: 'groups', loadChildren: () => import('./study-groups/study-groups.module').then(m => m.StudyGroupsModule) },
  { path: 'invitations', loadChildren: () => import('./invitations/invitations.module').then(m => m.InvitationsModule) },
  { path: '', redirectTo: '/groups', pathMatch: 'full' }
];



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
    ToastrModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(routes),  // Correct way
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
