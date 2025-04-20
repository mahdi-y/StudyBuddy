import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./frontoffice/home/home.component";
import {AboutComponent} from "./frontoffice/about/about.component";
import {WorkComponent} from "./frontoffice/work/work.component";
import {CategoryComponent} from "./frontoffice/category/category.component";
import {NotFoundComponent} from "./frontoffice/not-found/not-found.component";
import {DashboardComponent} from "./backoffice/dashboard/dashboard.component";
import {DashboardContentComponent} from "./backoffice/dashboard-content/dashboard-content.component";
import {StudyGroupComponent} from "./frontoffice/study-group/study-group.component";

const routes: Routes = [
  {
    path: 'groups',
    loadChildren: () => import('./study-groups/study-groups.module').then(m => m.StudyGroupsModule)
  },
  {
    path: 'invitations',
    loadChildren: () => import('./invitations/invitations.module').then(m => m.InvitationsModule)
  },
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'work', component: WorkComponent},
  { path: 'category', component: CategoryComponent},
  { path: 'study-group', component: StudyGroupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard-content', pathMatch: 'full' },
      { path: 'dashboard-content', component: DashboardContentComponent },
      // { path: 'studygroups', component: StudyGroupsComponent },
      // { path: 'resources', component: ResourcesComponent },
      // { path: 'tasks', component: TasksComponent },
      // { path: 'users', component: UsersComponent },
      // { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', component: NotFoundComponent },
  //{ path: '**', redirectTo: '/groups' } // Handle 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
