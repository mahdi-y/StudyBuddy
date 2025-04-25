import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable({ providedIn: 'root' })
export class GuestGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true; // allow access to login/register
  }
}
