import { Component, OnInit } from '@angular/core';
import { StudyGroupService } from '../../services/study-group.service';
import { InvitationService } from '../../services/invitation.service';  // Make sure you have this service
import { StudyGroup } from '../../models/study-group.model';  // Your study group model

@Component({
  selector: 'app-study-group-list',
  templateUrl: './study-group-list.component.html',
  styleUrls: ['./study-group-list.component.css']
})
export class StudyGroupListComponent implements OnInit {

  studyGroups: StudyGroup[] = [];  // An array to hold the list of study groups

  constructor(private studyGroupService: StudyGroupService, private invitationService: InvitationService) {}

  ngOnInit(): void {
    this.studyGroupService.getStudyGroups().subscribe((data) => {
      this.studyGroups = data;  // Fetch and populate the study groups
    });
  }

  // Define the sendInvitation method to handle the invitation logic
  sendInvitation(groupId: number): void {
    this.invitationService.sendInvitation(groupId).subscribe(
      response => {
        console.log('Invitation sent to group ID:', groupId, response);
      },
      error => {
        console.error('Error sending invitation:', error);
        // Handle error appropriately
      }
    );
  }
}
