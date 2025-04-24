import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { AuthGuard } from './services/auth.guard.service';
import {GuestGuardService} from "./services/guest-guard.service";
import {HomeComponent} from "./frontoffice/home/home.component";
import {AboutComponent} from "./frontoffice/about/about.component";
import {WorkComponent} from "./frontoffice/work/work.component";
import {CategoryComponent} from "./frontoffice/category/category.component";
import {NotFoundComponent} from "./frontoffice/not-found/not-found.component";
import {DashboardContentComponent} from "./backoffice/dashboard-content/dashboard-content.component";
import {StudyGroupComponent} from "./frontoffice/study-group/study-group.component";
import {DashboardComponent} from "./backoffice/dashboard/dashboard.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent , canActivate: [GuestGuardService]},
  { path: 'login', component: LoginComponent , canActivate: [GuestGuardService] },
  { path: 'about', component: AboutComponent },
  { path: 'work', component: WorkComponent},
  { path: 'category', component: CategoryComponent},
  { path: 'study-group', component: StudyGroupComponent , canActivate: [AuthGuard]},
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard-content', pathMatch: 'full'  },
      { path: 'dashboard-content', component: DashboardContentComponent },
      { path: 'backoffice', component: BackofficeComponent },
      // { path: 'studygroups', component: StudyGroupsComponent },
      // { path: 'resources', component: ResourcesComponent },
      // { path: 'tasks', component: TasksComponent },
      // { path: 'users', component: UsersComponent },
      // { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
