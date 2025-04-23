import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RessourceService } from 'src/app/services/ressource.service';
import { Ressource } from 'src/app/models/resource.model';

@Component({
  selector: 'app-ressource',
  templateUrl: './ressource.component.html',
  styleUrls: ['./ressource.component.css']
})
export class RessourceComponent implements OnInit {
  @Input() resources: Ressource[] = [];  // This receives resources from the parent
  @Output() refreshRequested = new EventEmitter<void>();  // This will emit the refresh request
  newResource: Ressource = new Ressource();  // Initialize using the constructor
  selectedResource: Ressource | null = null;

  constructor(private ressourcesService: RessourceService) {}

  ngOnInit(): void {
    // Initially load resources, you can remove this if resources are already passed as input
    if (this.resources.length === 0) {
      this.loadResources();
    }
  }

  loadResources(): void {
    console.log('Loading resources...');
    this.ressourcesService.getResources().subscribe({
      next: (data) => {
        console.log('Resources received:', data);
        this.resources = data;
      },
      error: (error) => console.error('Error fetching resources', error)
    });
  }

  createResource(): void {
    if (this.newResource.title) {  // Use title instead of name
      this.ressourcesService.addResource(this.newResource).subscribe({
        next: (res) => {
          this.resources.push(res);  // Add the new resource to the list
          this.newResource = new Ressource();  // Reset after adding
          this.refreshRequested.emit();  // Emit refresh request to parent component
        },
        error: (err) => console.error('Error creating resource', err)
      });
    }
  }

  editResource(resource: Ressource): void {
    this.selectedResource = { ...resource };
  }

  updateResource(): void {
    if (this.selectedResource) {
      this.ressourcesService.updateResource(this.selectedResource).subscribe({
        next: () => {
          this.refreshRequested.emit();  // Emit refresh request after update
          this.selectedResource = null;
        },
        error: (err) => console.error('Error updating resource', err)
      });
    }
  }
  downloadFile(resource: Ressource): void {
    const byteCharacters = atob(resource.fileUrl); // Decode base64
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' }); // Set MIME type to PDF

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title || 'download'}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url); // Cleanup
  }


  deleteResource(id: number): void {
    this.ressourcesService.deleteResource(id).subscribe({
      next: () => {
        this.resources = this.resources.filter(r => r.idResource !== id);
        this.refreshRequested.emit();  // Emit refresh request after delete
      },
      error: (err) => console.error('Error deleting resource', err)
    });
  }
}
