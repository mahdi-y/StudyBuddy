import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UsersListComponent },
  { path: 'user/add', component: UserAddComponent },
  { path: 'user/edit/:id', component: UserEditComponent },
  { path: 'user/:id', component: UserDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}