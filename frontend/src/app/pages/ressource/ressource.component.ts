import { Component, OnInit } from '@angular/core';
import { RessourceService } from 'src/app/services/ressource.service';
import { Ressource } from 'src/app/models/resource.model';

@Component({
  selector: 'app-ressource',
  templateUrl: './ressource.component.html',
  styleUrls: ['./ressource.component.css']
})
export class RessourceComponent implements OnInit {
  resources: Ressource[] = [];
  newResource: Ressource = new Ressource();  // Initialize using the constructor
  selectedResource: Ressource | null = null;

  constructor(private ressourcesService: RessourceService) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.ressourcesService.getResources().subscribe({
      next: (data) => this.resources = data,
      error: (error) => console.error('Error fetching resources', error)
    });
  }

  createResource(): void {
    if (this.newResource.title) {  // Use title instead of name
      this.ressourcesService.addResource(this.newResource).subscribe({
        next: (res) => {
          this.resources.push(res);
          this.newResource = new Ressource();  // Reset after adding
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
          this.loadResources();
          this.selectedResource = null;
        },
        error: (err) => console.error('Error updating resource', err)
      });
    }
  }

  deleteResource(id: number): void {
    this.ressourcesService.deleteResource(id).subscribe({
      next: () => {
        this.resources = this.resources.filter(r => r.idResource !== id);
      },
      error: (err) => console.error('Error deleting resource', err)
    });
  }
}
