import { Component, OnInit } from '@angular/core';
import { RessourceService } from 'src/app/services/ressource.service';
import { Ressource } from 'src/app/models/ressource.model';

@Component({
  selector: 'app-ressource',
  templateUrl: './ressource.component.html',
  styleUrls: ['./ressource.component.css']
})
export class RessourceComponent implements OnInit {
  ressources: Ressource[] = [];
  newRessource: Ressource = {
    title: '',
    fileUrl: '',
    type: '',
    description: '',
    category: { idCategory: 1 }, // default or dynamic
    user: { idUser: 1 },         // dummy user
    group: { idGroup: 1 }        // dummy group
  };

  constructor(private ressourceService: RessourceService) {}

  ngOnInit() {
    this.getAllRessources(); // Fetch resources when the component is initialized
  }

  getAllRessources(): void {
    this.ressourceService.getAll().subscribe({
      next: (data) => {
        console.log('Fetched ressources:', data);  // Check the full list here
        this.ressources = data;
      },
      error: (err) => {
        console.error('Error fetching ressources:', err);
      }
    });
  }


  addRessource(): void {
    this.ressourceService.create(this.newRessource).subscribe({
      next: (res) => {
        console.log('Ressource added:', res);
        this.getAllRessources(); // refresh the list after adding a resource
        this.newRessource = {  // reset the form fields after submission
          title: '',
          fileUrl: '',
          type: '',
          description: '',
          category: { idCategory: 1 },
          user: { idUser: 1 },
          group: { idGroup: 1 }
        };
      },
      error: (err) => {
        console.error('Error adding ressource:', err);
      }
    });
  }

  deleteRessource(id: number | undefined): void {
    if (!id) return;
    this.ressourceService.delete(id).subscribe({
      next: () => {
        console.log('Ressource deleted');
        this.getAllRessources(); // refresh the list after deleting a resource
      },
      error: (err) => {
        console.error('Error deleting ressource:', err);
      }
    });
  }
}
