import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isSidebarCollapsed = false;
  showProfileDropdown = false;
  activeLink = 'dashboard';
  currentYear: number = new Date().getFullYear();
  user: { username: string; role: string; profilePicture?: string } | null;
  statistics: { totalAccounts: number; agePercentages: { [key: string]: number } } | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadUserProfile();
      
    } else {
      console.error('No user found in AuthService');
      this.router.navigate(['/login']);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  setActive(link: string) {
    this.activeLink = link;
    if (window.innerWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }

  getPageTitle(): string {
    switch (this.activeLink) {
      case 'dashboard': return 'Dashboard';
      case 'study-groups': return 'Study Groups Dashboard';
      case 'resources': return 'Resources Dashboard';
      case 'tasks': return 'Tasks Dashboard';
      case 'users': return 'Users Dashboard';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadUserProfile(): void {
    console.log('Fetching profile for user:', this.user?.username);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const currentUser = users.find(u => u.username === this.user!.username);
        if (currentUser && this.user) {
          console.log('Fetched profile picture URL:', currentUser.profilePicture);
          this.user.profilePicture = currentUser.profilePicture;
          const img = new Image();
          img.src = this.user.profilePicture || 'assets/backoffice/images/default-profile.jpg';
          img.onload = () => {
            if (this.user) {
              console.log('Profile picture loaded successfully:', this.user.profilePicture);
            }
          };
          img.onerror = () => {
            if (this.user) {
              console.error('Failed to load profile picture:', this.user.profilePicture);
            }
          };
        } else {
          console.warn('User not found in API response:', this.user?.username);
          if (this.user) {
            this.user.profilePicture = 'assets/backoffice/images/profile.jpg';
          }
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        if (this.user) {
          this.user.profilePicture = 'assets/backoffice/images/profile.jpg';
        }
      }
    });
  }

  
}