import { Component, OnInit } from '@angular/core';
import { RessourceService } from 'src/app/services/ressource.service';

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
  showModal: boolean = false;
  newResource: any = { title: '', fileUrl: '', description: '' };
  selectedFile: File | null = null;

  resources: any[] = [];

  constructor(private ressourceService: RessourceService) {}

  ngOnInit(): void {
    this.loadResources();

    // Example groups
    this.studyGroups = [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' },
      { id: 3, name: 'Group 3' },
      { id: 4, name: 'Group 4' }
    ];

    // Optional: default to the first group
    if (this.studyGroups.length > 0) {
      this.selectedGroup = this.studyGroups[0];
    }
  }

  get filteredGroups() {
    return this.studyGroups.filter(group => group.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
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

  openAddResourceModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetNewResource();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);  // Log the file to check if it's correct
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        this.newResource.fileUrl = base64Data;
      };
      reader.readAsDataURL(file);
    }
  }

  createResource(): void {
    if (this.newResource.title && this.newResource.fileUrl && this.newResource.description && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      console.log('FormData being sent:', formData);  // Log FormData

      // Send the file for OCR processing
      this.ressourceService.uploadImageForOCR(formData).subscribe({
        next: (response) => {
          console.log('OCR processing response:', response);  // Log the backend response
          if (response.base64File) {
            this.newResource.fileUrl = response.base64File;

            // Save the resource with the OCR PDF
            const resourceToAdd = {
              ...this.newResource,
              category: this.selectedGroup ? { id: this.selectedGroup.id } : null,
            };

            this.saveResource(resourceToAdd);
          } else {
            alert('OCR processing failed: No Base64 file returned.');
          }
        },
        error: (err) => {
          console.error('Error during OCR processing:', err);
          alert('An error occurred during OCR processing.');
        }
      });
    } else {
      alert('Please fill out all fields and select a file.');
    }
  }



  saveResource(resourceToAdd: any): void {
    this.ressourceService.addResource(resourceToAdd).subscribe({
      next: (res) => {
        console.log('Resource successfully added:', res);
        this.loadResources(); // 🔁 Refresh the list after adding
        this.closeModal();    // Hide modal and reset form
      },
      error: (err) => {
        console.error('Error adding resource:', err);
        alert('An error occurred while saving the resource.');
      }
    });
  }

  resetNewResource(): void {
    this.newResource = { title: '', fileUrl: '', description: '' };
    this.selectedFile = null;
  }

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
