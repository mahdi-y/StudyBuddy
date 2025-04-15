import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(id).subscribe(data => {
      this.user = data;
    });
  }
}