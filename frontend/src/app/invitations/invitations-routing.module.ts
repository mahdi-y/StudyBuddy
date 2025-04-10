import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { InvitationSendComponent } from './invitation-send/invitation-send.component';

const routes: Routes = [
  { path: '', component: InvitationListComponent },
  { path: 'send/:groupId', component: InvitationSendComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvitationsRoutingModule { }