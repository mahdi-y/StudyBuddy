import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './task/task.component';
import { AddTaskComponent } from './task/add/add.component';
import { UpdateTaskComponent } from './task/update/update.component';

const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskComponent },
  { path: 'task/add', component: AddTaskComponent },
  { path: 'task/update/:id', component: UpdateTaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
