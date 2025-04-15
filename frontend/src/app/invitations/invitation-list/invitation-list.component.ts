import { Component } from '@angular/core';

@Component({
  selector: 'app-invitation-list',
  templateUrl: './invitation-list.component.html',
  styleUrls: ['./invitation-list.component.css']
})
export class InvitationListComponent {
  constructor() {
    console.log('Invitation List Component Loaded');
  }
}
