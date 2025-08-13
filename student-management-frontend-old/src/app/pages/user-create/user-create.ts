import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-user-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.html',
})
export class UserCreate {
  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    role: new FormControl('STUDENT', Validators.required), // Default to STUDENT
    first_name: new FormControl(''),
    last_name: new FormControl(''),
  });
  roles: string[] = ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'];

  constructor(private apiService: Api, private router: Router) {}

  onSubmit(): void {
    if (this.userForm.valid) {
      this.apiService.createUser(this.userForm.value).subscribe({
        next: () => {
          console.log('User created successfully!');
          // Navigate to the user management page on success
          this.router.navigate(['/user-management']);
        },
        error: (err) => console.error('Failed to create user:', err)
      });
    }
  }
}