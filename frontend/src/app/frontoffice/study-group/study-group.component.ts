import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-study-group',
  templateUrl: './study-group.component.html',
  styleUrls: ['./study-group.component.scss']
})
export class StudyGroupComponent implements OnInit {

  studyGroups: any[] = []; // Example data
  selectedGroup: any | null = null;
  searchTerm: string = '';
  isSidebarCollapsed: boolean = false;
  showProfileDropdown = false;


  constructor() {}

  ngOnInit(): void {
    // Initialize the study groups (example data)
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

    // Set the first group as the selected group by default
    if (this.studyGroups.length > 0) {
      this.selectedGroup = this.studyGroups[0]; // Select the first group
    }
  }

  // Filter groups based on the search term
  get filteredGroups() {
    return this.studyGroups.filter(group => group.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Toggle sidebar visibility
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Select a study group
  selectGroup(group: any): void {
    this.selectedGroup = group;
  }

  // Toggle profile dropdown visibility
  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }
}
