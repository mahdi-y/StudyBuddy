import { Component, OnInit } from '@angular/core';
import { StudyGroupService } from '../../services/study-group.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-study-group',
  templateUrl: './study-group.component.html',
  styleUrls: ['./study-group.component.css']
})
export class StudyGroupComponent implements OnInit {

  studyGroups$!: Observable<any[]>;
  userId!: number;

  constructor(
    private studyGroupService: StudyGroupService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.loadStudyGroups();
  }

  loadStudyGroups(): void {
    this.studyGroups$ = this.studyGroupService.getUserStudyGroups(this.userId).pipe(
      map(data => data) // Optionally transform data if needed
    );
  }
}
