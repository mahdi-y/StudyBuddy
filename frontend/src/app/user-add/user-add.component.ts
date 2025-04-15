import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html'
})
export class UserAddComponent {
  user: User = { username: '', useremail: '', password: '', profilePicture: '', role: 'USER' };

  constructor(private userService: UserService, private router: Router) {}

  addUser(): void {
    this.userService.addUser(this.user).subscribe(() => {
      this.router.navigate(['/users']);
    });
  }
}