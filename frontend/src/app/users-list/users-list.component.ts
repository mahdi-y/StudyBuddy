import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  deleteUser(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u.iduser !== id);
      });
    }
  }
}