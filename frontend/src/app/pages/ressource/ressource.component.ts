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

  constructor(private ressourcesService: RessourceService) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.ressourcesService.getResources().subscribe(
      (data) => {
        this.resources = data;
      },
      (error) => {
        console.error('Error fetching resources', error);
      }
    );
  }
}
