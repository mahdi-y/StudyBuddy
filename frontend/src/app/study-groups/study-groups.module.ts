import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyGroupListComponent } from './study-group-list/study-group-list.component';
import { StudyGroupCreateComponent } from './study-group-create/study-group-create.component';

// Import Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { StudyGroupsRoutingModule } from './study-groups-routing.module';
import { RouterModule } from '@angular/router';   // <-- Add this



@NgModule({
  declarations: [
    StudyGroupListComponent,
    StudyGroupCreateComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,            // Material Card Module
    MatButtonModule,          // Material Button Module
    MatIconModule,            // Material Icon Module
    MatFormFieldModule,       // Material Form Field Module (if needed)
    MatInputModule,           // Material Input Module (if needed)
    FormsModule,
    RouterModule,
    StudyGroupsRoutingModule               // For template-driven forms
  ]
})
export class StudyGroupsModule { }
