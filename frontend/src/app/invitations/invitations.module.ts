import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { InvitationSendComponent } from './invitation-send/invitation-send.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';   // <-- Add this
 
import { InvitationsRoutingModule } from './invitations-routing.module';


@NgModule({
  declarations: [
    InvitationListComponent,
    InvitationSendComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    InvitationsRoutingModule,
    RouterModule,
    FormsModule
  ]
})
export class InvitationsModule { }