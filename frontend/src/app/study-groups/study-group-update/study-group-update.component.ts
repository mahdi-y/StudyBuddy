import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudyGroupService } from 'src/app/services/study-group.service';
import { StudyGroup } from 'src/app/models/study-group.model';

@Component({
  selector: 'app-study-group-update',
  templateUrl: './study-group-update.component.html',
  styleUrls: ['./study-group-update.component.css']
})
export class StudyGroupUpdateComponent implements OnInit {
  groupId!: number; // ✅ corrigé avec `!` pour dire à TypeScript "je le définirai plus tard"
  studyGroup: StudyGroup = {} as StudyGroup; // ✅ évite le `new StudyGroup()` si c’est une interface
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studyGroupService: StudyGroupService
  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
  
    // ✅ Assure-toi que cette méthode existe dans ton service
    this.studyGroupService.getGroupById(this.groupId).subscribe({
      next: (group: StudyGroup) => {
        this.studyGroup = group;
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération du groupe:', err);
      }
    });
  }

  updateGroup(): void {
    // ✅ Assure-toi que cette méthode existe dans ton service
    this.studyGroupService.updateGroup(this.groupId, this.studyGroup).subscribe({
      next: () => {
        console.log('Groupe mis à jour avec succès');
        this.router.navigate(['/groups']);
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour:', err);
      }
    });
  }
}
