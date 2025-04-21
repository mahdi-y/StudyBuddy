import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {
  user: User = { username: '', useremail: '', password: '', profile_picture: '', role: 'USER' };
  id: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.userService.getUser(this.id).subscribe(data => {
      this.user = { ...data, password: '' }; // Avoid sending password back unless updated
    });
  }

  updateUser(): void {
    this.userService.updateUser(this.id, this.user).subscribe(() => {
      this.router.navigate(['/users']);
    });
  }
}