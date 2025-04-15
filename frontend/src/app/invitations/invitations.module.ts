import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { InvitationSendComponent } from './invitation-send/invitation-send.component';
import { InvitationsComponent } from './invitations.component'; // <-- Add this line
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { InvitationsRoutingModule } from './invitations-routing.module';

@NgModule({
  declarations: [
    InvitationsComponent,                
    InvitationListComponent,
    InvitationSendComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,         
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
    MatInputModule,
    InvitationsRoutingModule,
    FormsModule
  ]
})
export class InvitationsModule { }
