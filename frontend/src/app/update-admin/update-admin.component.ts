import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-admin',
  templateUrl: './update-admin.component.html',
  styleUrls: ['./update-admin.component.css']
})
export class UpdateAdminComponent implements OnInit {
 // Import the Router service
  user: any;
  updateForm: FormGroup;
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  selectedFile: File | null = null;
  isLoading = false;
  
  private apiUrl = 'http://localhost:8083/api/users';
  private uploadUrl = 'http://localhost:8083/Upload';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private storage: LocalStorageService
  ) {
    this.updateForm = new FormGroup({
       // Username typically shouldn't be editable
      
      address: new FormControl('', [Validators.required, Validators.email]),
      mobileNo: new FormControl('', [
        Validators.pattern(/^\+[1-9]\d{1,14}$/) // E.164 format
      ]),
      age: new FormControl('', [Validators.min(0), Validators.max(120)]),
      profilePicture: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const token = this.storage.get('auth-token');
    if (!token) {
      this.showMessage('Please log in to view your profile.', 'error');
      return;
    }

    this.isLoading = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get(`${this.apiUrl}/me`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Failed to fetch user details:', error);
        if (error.status === 403) {
          this.showMessage('Access denied. Please check your permissions.', 'error');
        } else if (error.status === 401) {
          this.showMessage('Session expired. Please log in again.', 'error');
          this.storage.remove('auth-token');
        } else {
          this.showMessage('Error loading profile details. Please try again.', 'error');
        }
        return throwError(error);
      })
    ).subscribe({
      next: (user: any) => {
        this.user = user;
        this.updateForm.patchValue({
          username: user.username,
          
          address: user.address || '',
          mobileNo: user.mobileNo || '',
          age: user.age || ''
        });
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profilePictureUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateProfile(): void {
    if (this.updateForm.invalid) {
      this.markFormGroupTouched(this.updateForm);
      this.showMessage('Please fill out the form correctly.', 'error');
      return;
    }
  
    const token = this.storage.get('auth-token');
    if (!token) {
      this.showMessage('Session expired. Please log in again.', 'error');
      return;
    }
  
    this.isLoading = true;
    
    // Prepare the update data
    const updateData = {
      address: this.updateForm.value.address,
      mobileNo: this.updateForm.value.mobileNo,
      age: this.updateForm.value.age ? Number(this.updateForm.value.age) : null
    };
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Update user data
    this.http.put(`${this.apiUrl}/me`, updateData, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Update failed:', error);
        this.handleUpdateError(error);
        return throwError(error);
      })
    ).subscribe({
      next: () => {
        // If there's a file, upload it separately
        if (this.selectedFile) {
          this.uploadProfilePicture(token);
        } else {
          this.isLoading = false;
          this.showMessage('Profile updated successfully!', 'success');
          this.loadUserProfile(); // Refresh data
  
          // Redirect to study-group page after successful profile update
          this.router.navigate(['/dashboard']); // Assuming the route is "/study-group"
        }
      }
    });
  }

  private uploadProfilePicture(token: string): void {
    if (!this.selectedFile) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', this.selectedFile, this.selectedFile.name);
    uploadFormData.append('userId', this.user.id.toString());

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type - let browser set it with boundary
    });

    this.http.post(this.uploadUrl, uploadFormData, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Profile picture upload failed:', error);
        this.showMessage('Profile updated but picture upload failed', 'error');
        return throwError(error);
      })
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.showMessage('Profile and picture updated successfully!', 'success');
        this.loadUserProfile(); // Refresh data
      }
    });
  }

  private handleUpdateError(error: HttpErrorResponse): void {
    if (error.status === 403) {
      this.showMessage('You do not have permission to update this profile.', 'error');
    } else if (error.status === 401) {
      this.showMessage('Session expired. Please log in again.', 'error');
      this.storage.remove('auth-token');
    } else {
      this.showMessage(`Failed to update profile: ${error.error?.message || error.message}`, 'error');
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000); // Auto-hide after 5 seconds
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

