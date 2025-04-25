import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvitationsComponent } from './invitations.component';
import { InvitationListComponent } from './invitation-list/invitation-list.component';

const routes: Routes = [
  {
    path: '',
    component: InvitationsComponent,
    children: [
      { path: '', component: InvitationListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvitationsRoutingModule { }
