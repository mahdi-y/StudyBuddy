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
import {DashboardComponent} from "./backoffice/dashboard/dashboard.component";
import {DashboardContentComponent} from "./backoffice/dashboard-content/dashboard-content.component";
import {StudyGroupListComponent} from "./study-groups/study-group-list/study-group-list.component";
import {StudyGroupCreateComponent} from "./study-groups/study-group-create/study-group-create.component";
import {StudyGroupUpdateComponent} from "./study-groups/study-group-update/study-group-update.component";
import {FlashcardComponent} from "./study-groups/flashcards/flashcards.component";
import {RessourceComponent} from "./pages/ressource/ressource.component";

const routes: Routes = [

  {
    path: 'invitations',
    loadChildren: () => import('./invitations/invitations.module').then(m => m.InvitationsModule)
  },
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent , canActivate: [GuestGuardService]},
  { path: 'login', component: LoginComponent , canActivate: [GuestGuardService] },
  { path: 'about', component: AboutComponent },
  { path: 'work', component: WorkComponent},
  { path: 'category', component: CategoryComponent},
  { path: 'study-group', component: StudyGroupListComponent, canActivate: [AuthGuard]},
  { path: 'study-group/new', component: StudyGroupCreateComponent, canActivate: [AuthGuard] },     // For creating a new study group
  { path: 'study-group/update-group/:id', component: StudyGroupUpdateComponent, canActivate: [AuthGuard] },
  { path: 'flashcards', component: FlashcardComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard-content', pathMatch: 'full'  },
      { path: 'dashboard-content', component: DashboardContentComponent },
      { path: 'backoffice', component: BackofficeComponent },
      { path: 'resources', component: RessourceComponent }, // Resources route (This will render RessourceComponent)

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
