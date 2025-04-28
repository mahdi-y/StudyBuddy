// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SignupRequest } from '../models/signup-request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  request: SignupRequest = new SignupRequest();
  msg: string | undefined;

  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    address: new FormControl(''),
    mobileno: new FormControl(''),
    age: new FormControl(''),
    profilePicture: new FormControl(null) // New field for profile picture
  });

  constructor(
    private authService: AuthService,
    private storage: LocalStorageService,
    private router: Router
  ) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.request.profilePicture = input.files[0];
      this.signupForm.patchValue({ profilePicture: input.files[0] });
    }
  }

  onSubmit(): void {
    this.storage.remove('auth-token');
    const formValue = this.signupForm.value;
    this.request.name = formValue.name;
    this.request.username = formValue.username;
    this.request.password = formValue.password;
   /* this.request.mobileno = formValue.mobileno;
    this.request.address = formValue.address;
    this.request.age = formValue.age;*/

    if (this.signupForm.valid) {
      console.log('Form is valid');
      this.authService.register(this.request).subscribe({
        next: (res) => {
          this.msg = res.response;
          console.log(res.response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.msg = 'Registration failed: ' + (err.error.response || err.message);
          console.log('Error Received:', err);
        }
      });
    } else {
      console.log('Form is invalid.');
      this.msg = 'Please fill all required fields.';
    }
  }
}