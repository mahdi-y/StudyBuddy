import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RessourceComponent } from './components/ressource/ressource.component';
import { HomeComponent } from './home/home.component'; // Import the HomeComponent
import { CategoryComponent } from './components/category/category.component';

const routes: Routes = [
  { path: 'ressources', component: RessourceComponent }, // /ressources should load the RessourceComponent
  { path: 'home', component: HomeComponent }, // /home should load the HomeComponent
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route should go to /home
  { path: 'categories', component: CategoryComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
