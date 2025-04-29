// src/app/register/register.component.ts
import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
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
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z\s]*$/)
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z0-9_]+$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl(''), // Add this line
    mobileno: new FormControl(''), // Add this line
    age: new FormControl(''), // Add this line
    profilePicture: new FormControl(null)
  }, { validators: this.passwordMatchValidator });

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
    this.storage.remove('auth-token'); // Clear any existing token
    const formValue = this.signupForm.value;

    // Map form values to the request object
    this.request.name = formValue.name;
    this.request.username = formValue.username;
    this.request.password = formValue.password;

    if (this.signupForm.valid) {
      console.log('Form is valid');
      this.authService.register(this.request).subscribe({
        next: (res) => {
          // Check if the response indicates success
          if (res && res.response && res.response.includes('User created')) {
            this.msg = res.response; // Show success message
            console.log(res.response);
            this.router.navigate(['/login']); // Redirect only on success
          } else {
            this.msg = 'Registration failed: Unexpected response from server.';
            console.error('Unexpected response:', res);
          }
        },
        error: (err) => {
          // Extract the error message from the backend response
          let errorMessage = 'Registration failed: An unexpected error occurred.';
          if (err.error && err.error.response) {
            errorMessage = `Registration failed: ${err.error.response}`;
          }
          this.msg = errorMessage; // Display the exact error message
          console.error('Error Received:', err);
        }
      });
    } else {
      console.log('Form is invalid.');
      this.msg = 'Please fill all required fields.';
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }
}
