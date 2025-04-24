import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { AuthGuard } from './services/auth.guard.service';
import {GuestGuardService} from "./services/guest-guard.service";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent , canActivate: [GuestGuardService]},
  { path: 'login', component: LoginComponent , canActivate: [GuestGuardService] },
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard]},
  { path: 'backoffice', component: BackofficeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] // Exports RouterModule to make router-outlet available
})
export class AppRoutingModule { }
