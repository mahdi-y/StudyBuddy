import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StudyGroupService} from "./services/study-group.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  userId!: number;
  chatId!: number;
  studyGroupId!: number;

  constructor(private route: ActivatedRoute, private studyGroupService: StudyGroupService) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.studyGroupId = Number(this.route.snapshot.paramMap.get('studyGroupId'));

    this.studyGroupService.getChatIdByStudyGroupId(this.studyGroupId).subscribe({
      next: (chatId) => {
        this.chatId = chatId;
      },
      error: (err) => {
        console.error('Error fetching chatId', err);
      }
    });
  }
}
