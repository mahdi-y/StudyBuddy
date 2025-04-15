import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyGroupListComponent } from './study-group-list/study-group-list.component';
import { StudyGroupCreateComponent } from './study-group-create/study-group-create.component';
import { StudyGroupUpdateComponent } from './study-group-update/study-group-update.component'; // Import your update component

const routes: Routes = [
  { path: '', component: StudyGroupListComponent },          // Lists all groups
  { path: 'new', component: StudyGroupCreateComponent },     // For creating a new study group
  { path: 'update-group/:id', component: StudyGroupUpdateComponent }, // For updating an existing study group by ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyGroupsRoutingModule { }
