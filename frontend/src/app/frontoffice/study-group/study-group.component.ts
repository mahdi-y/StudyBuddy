import { Component, OnInit } from '@angular/core';
import { RessourceService } from 'src/app/services/ressource.service';
import { RessourceComponent } from 'src/app/pages/ressource/ressource.component';
import { Ressource } from 'src/app/models/resource.model';

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
  showModal: boolean = false; // Modal visibility flag
  newResource: any = { title: '', fileUrl: '', description: '' }; // New resource data
  selectedFile: File | null = null; // Store selected file

  constructor(private ressourceService: RessourceService) {}

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

  // Open modal for adding new resource
  openAddResourceModal(): void {
    this.showModal = true; // Show modal
  }

  // Close the modal
  closeModal(): void {
    this.showModal = false; // Hide modal
    this.resetNewResource(); // Reset resource data
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Optional: Preview file locally or store its URL (this could just be a placeholder for now)
      const objectUrl = URL.createObjectURL(file);
      this.newResource.fileUrl = objectUrl; // Update the fileUrl field
    }
  }

  // Create the resource with file upload
  createResource(): void {
    if (this.newResource.title && this.newResource.fileUrl && this.newResource.description) {
      if (this.selectedGroup) {
        const resourceToAdd = {
          ...this.newResource,
          category: { id: this.selectedGroup.id }  // Attach the category
        };

        // If a file is selected, upload it first
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('file', this.selectedFile);

          this.ressourceService.uploadFile(formData).subscribe({
            next: (response: any) => {
              // Assuming the response contains the uploaded file URL
              this.newResource.fileUrl = response.url || response;

              // Now save the resource with the file URL
              this.saveResource(resourceToAdd);
            },
            error: (err) => {
              console.error('File upload failed:', err);
              alert('An error occurred while uploading the file.');
            }
          });
        } else {
          // No file selected, save the resource directly
          this.saveResource(resourceToAdd);
        }
      } else {
        alert('Please select a study group first.');
      }
    } else {
      alert('Please fill out all fields.');
    }
  }

  // Save the resource to the backend
  saveResource(resourceToAdd: any): void {
    this.ressourceService.addResource(resourceToAdd).subscribe({
      next: (res) => {
        this.loadResources(); // 🔁 Refresh the list
        console.log('Resource successfully added:', res);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error adding resource:', err);
        alert('An error occurred while saving the resource.');
      }
    });
  }

  // Reset new resource data
  resetNewResource(): void {
    this.newResource = { title: '', fileUrl: '', description: '' };
    this.selectedFile = null; // Reset the selected file
  }

  // Load resources list
  resources: any[] = [];

  loadResources(): void {
    this.ressourceService.getResources().subscribe({
      next: (data) => {
        this.resources = data;
        console.log('Resources loaded:', this.resources);
      },
      error: (err) => {
        console.error('Error loading resources:', err);
      }
    });
  }
}
