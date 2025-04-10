import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyGroupListComponent } from './study-group-list/study-group-list.component';
import { StudyGroupCreateComponent } from './study-group-create/study-group-create.component';

const routes: Routes = [
  { path: '', component: StudyGroupListComponent },
  { path: 'new', component: StudyGroupCreateComponent },
  { path: ':id', component: StudyGroupCreateComponent } // For edit view
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyGroupsRoutingModule { }