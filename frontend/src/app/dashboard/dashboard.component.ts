import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.css'] }) export class DashboardComponent { user: { username: string; role: string } | null;

constructor(private authService: AuthService, private router: Router) { this.user = this.authService.getCurrentUser(); }

logout(): void { this.authService.logout(); this.router.navigate(['/login']); } }