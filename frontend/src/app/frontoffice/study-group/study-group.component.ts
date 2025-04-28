import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-study-group',
  templateUrl: './study-group.component.html',
  styleUrls: ['./study-group.component.scss']
})
export class StudyGroupComponent implements OnInit {

  studyGroups: any[] = [];
  selectedGroup: any | null = null;
  searchTerm: string = '';
  isSidebarCollapsed: boolean = false;
  showProfileDropdown = false;
  user: { username: string; role: string; profilePicture?: string } | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadUserProfile();
    } else {
      console.error('No user found in AuthService');
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.studyGroups = [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' },
      { id: 3, name: 'Group 3' },
      { id: 4, name: 'Group 4' },
      { id: 5, name: 'Group 5' },
      { id: 6, name: 'Group 6' },
      { id: 7, name: 'Group 7' },
      { id: 8, name: 'Group 8' },
      { id: 9, name: 'Group 9' },
      { id: 10, name: 'Group 10' },
      { id: 11, name: 'Group 11' },
      { id: 12, name: 'Group 12' },
      { id: 13, name: 'Group 13' }
    ];

    if (this.studyGroups.length > 0) {
      this.selectedGroup = this.studyGroups[0];
    }
  }

  get filteredGroups() {
    return this.studyGroups.filter(group =>
      group.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectGroup(group: any): void {
    this.selectedGroup = group;
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
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
          img.src = this.user.profilePicture || 'assets/backoffice/images/profile.jpg';
          img.onload = () => {
            if (this.user) {
              console.log('Profile picture loaded successfully:', this.user.profilePicture);
            }
          };
          img.onerror = () => {
            if (this.user) {
              console.error('Failed to load profile picture:', this.user.profilePicture);
              this.user.profilePicture = 'assets/backoffice/images/profile.jpg';
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
