import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './frontoffice/home/home.component';
import { AboutComponent } from './frontoffice/about/about.component';
import { WorkComponent } from './frontoffice/work/work.component';
import { CategoryComponent } from './frontoffice/category/category.component';
import { NotFoundComponent } from './frontoffice/not-found/not-found.component';
import { DashboardComponent } from './backoffice/dashboard/dashboard.component';
import { DashboardContentComponent } from './backoffice/dashboard-content/dashboard-content.component';
import { StudyGroupComponent } from './frontoffice/study-group/study-group.component';
import { RessourceComponent } from './pages/ressource/ressource.component'; // Resource Component import

// Define routes
const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'about', component: AboutComponent }, // About route
  { path: 'work', component: WorkComponent }, // Work route
  { path: 'category', component: CategoryComponent }, // Category route
  { path: 'study-group', component: StudyGroupComponent }, // Study group route
  {
    path: 'dashboard', // Dashboard route
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard-content', pathMatch: 'full' }, // Default child route for dashboard
      { path: 'dashboard-content', component: DashboardContentComponent }, // Dashboard content route
      { path: 'resources', component: RessourceComponent }, // Resources route (This will render RessourceComponent)

      // Uncomment these routes when needed:

      // { path: 'studygroups', component: StudyGroupsComponent }, // Study groups route (If you have a study groups component)
      // { path: 'tasks', component: TasksComponent }, // Tasks route (If you have a tasks component)
      // { path: 'users', component: UsersComponent }, // Users route (If you have a users component)
      // { path: 'settings', component: SettingsComponent }, // Settings route (If you have a settings component)
    ]
  },
  { path: '**', component: NotFoundComponent } // Wildcard route for 404 page
];

// Create the NgModule for routing
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import the routes
  exports: [RouterModule] // Export RouterModule to make routing available in the app
})
export class AppRoutingModule { }
