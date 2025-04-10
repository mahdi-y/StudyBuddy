import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'groups', 
    loadChildren: () => import('./study-groups/study-groups.module').then(m => m.StudyGroupsModule) 
  },
  { 
    path: 'invitations', 
    loadChildren: () => import('./invitations/invitations.module').then(m => m.InvitationsModule) 
  },
  { path: '', redirectTo: '/groups', pathMatch: 'full' },
  { path: '**', redirectTo: '/groups' } // Handle 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }