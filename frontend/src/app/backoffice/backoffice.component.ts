import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent implements OnInit {
  users: any[] = [];
  isAdmin: boolean = false;
  newUser: any = { name: '', username: '', password: '', address: '', mobileNo: '', age: null, role: 'USER' };
  originalUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.checkAdminRole();
    if (this.isAdmin) {
      this.loadUsers();
    }
  }

  checkAdminRole(): void {
    const token = localStorage.getItem('auth-token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Role from token:', payload.role);
      this.isAdmin = payload.role === 'ADMIN';
      console.log('isAdmin:', this.isAdmin);
    } else {
      console.log('No token found in local storage');
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({ ...user, editing: false }));
        this.originalUsers = JSON.parse(JSON.stringify(users));
        console.log('Users loaded:', this.users);
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  onCreateUser(): void {
    this.userService.createUser(this.newUser).subscribe({
      next: (createdUser) => {
        this.users.push({ ...createdUser, editing: false });
        this.newUser = { name: '', username: '', password: '', address: '', mobileNo: '', age: null, role: 'USER' };
        this.originalUsers = JSON.parse(JSON.stringify(this.users));
      },
      error: (err) => {
        console.error('Error creating user:', err);
      }
    });
  }

  editUser(user: any): void {
    user.editing = true;
  }

  onUpdateUser(user: any): void {
    this.userService.updateUser(user.id, user).subscribe({
      next: (updatedUser) => {
        user.editing = false;
        Object.assign(user, updatedUser);
        this.originalUsers = JSON.parse(JSON.stringify(this.users));
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }

  cancelEdit(user: any): void {
    const original = this.originalUsers.find(u => u.id === user.id);
    Object.assign(user, original);
    user.editing = false;
  }

  onDeleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
        this.originalUsers = JSON.parse(JSON.stringify(this.users));
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }

 
}