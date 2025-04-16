import { Component, HostListener } from '@angular/core';

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
}
