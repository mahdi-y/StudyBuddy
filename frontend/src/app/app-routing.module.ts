import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { AuthGuard } from './services/auth.guard.service';
import {GuestGuardService} from "./services/guest-guard.service";
import { TaskComponent } from './task/task.component';
import { AddTaskComponent } from './task/add/add.component';
import { UpdateTaskComponent } from './task/update/update.component';
import { ProgressComponent } from './progress/progress.component';
import { StudyGroupsBackComponent } from './backoffice/study-groups-back/study-groups-back.component'; // Adjust the path as needed
import { TaskBackofficeComponent} from "./backoffice/task-backoffice/task-backoffice.component";
import {HomeComponent} from "./frontoffice/home/home.component";
import {AboutComponent} from "./frontoffice/about/about.component";
import {WorkComponent} from "./frontoffice/work/work.component";
import {CategoryComponent} from "./frontoffice/category/category.component";
import {NotFoundComponent} from "./frontoffice/not-found/not-found.component";
import {DashboardComponent} from "./backoffice/dashboard/dashboard.component";
import {DashboardContentComponent} from "./backoffice/dashboard-content/dashboard-content.component";
import {StudyGroupListComponent} from "./study-groups/study-group-list/study-group-list.component";
import {StudyGroupCreateComponent} from "./study-groups/study-group-create/study-group-create.component";
import {StudyGroupUpdateComponent} from "./study-groups/study-group-update/study-group-update.component";
import {FlashcardComponent} from "./study-groups/flashcards/flashcards.component";
import {StudyGroupComponent} from "./frontoffice/study-group/study-group.component";
import {ReportedMessagesComponent} from "./backoffice/reported-messages/reported-messages.component";
import {UnauthorizedComponent} from "./frontoffice/unauthorized/unauthorized.component";
import {RessourceComponent} from "./pages/ressource/ressource.component";
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdateAdminComponent } from './update-admin/update-admin.component';


const routes: Routes = [

  {
    path: 'invitations',
    loadChildren: () => import('./invitations/invitations.module').then(m => m.InvitationsModule)
  },

  { path: '', component: HomeComponent },
  { path: 'update-admin', component: UpdateAdminComponent },
  { path: 'request-reset', component: RequestResetComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register', component: RegisterComponent , canActivate: [GuestGuardService]},
  { path: 'login', component: LoginComponent , canActivate: [GuestGuardService] },
  { path: 'about', component: AboutComponent },
  { path: 'work', component: WorkComponent},
  { path: 'category', component: CategoryComponent},
  { path: 'study-group', component: StudyGroupListComponent, canActivate: [AuthGuard]},
  { path: 'study-group/new', component: StudyGroupCreateComponent, canActivate: [AuthGuard] },     // For creating a new study group
  { path: 'study-group/update-group/:id', component: StudyGroupUpdateComponent, canActivate: [AuthGuard] },
  { path: 'flashcards', component: FlashcardComponent },
  { path: 'unauthorized', component: UnauthorizedComponent},
  { path: 'study-group-task', component: StudyGroupComponent },
  { path: 'tasks', component: TaskComponent },
  { path: 'task/add', component: AddTaskComponent },
  { path: 'update/:id', component: UpdateTaskComponent },
  { path: 'progress', component: ProgressComponent },

  { path: 'study-group', component: StudyGroupComponent , canActivate: [AuthGuard]},
  { path: 'update-profile', component: UpdateProfileComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    //canActivate: [AuthGuard],
    //data: { role: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard-content', pathMatch: 'full'  },
      { path: 'dashboard-content', component: DashboardContentComponent },
      { path: 'message-reports', component: ReportedMessagesComponent},
      { path: 'backoffice', component: BackofficeComponent },

      {path: 'study-groups-back', component: StudyGroupsBackComponent},
      { path: 'resources', component: RessourceComponent }, // Resources route (This will render RessourceComponent)
      { path: 'task-list', component: TaskBackofficeComponent }
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
  imports: [RouterModule.forRoot(routes)], // Import the routes
  exports: [RouterModule] // Export RouterModule to make routing available in the app
})
export class AppRoutingModule { }
