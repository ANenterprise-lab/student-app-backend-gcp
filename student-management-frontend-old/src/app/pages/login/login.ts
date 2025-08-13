import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private apiService: Api, private router: Router) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe({
        next: () => {
          this.apiService.currentUser.subscribe(user => {
            if (user) {
              // This is the updated logic
              if (user.role === 'TEACHER') {
                this.router.navigate(['/teacher-dashboard']); // Updated redirect for Teachers
              } else if (user.role === 'ADMIN') {
                this.router.navigate(['/admin-dashboard']);
              } else if (user.role === 'STUDENT') {
                this.router.navigate(['/student-dashboard']);
              } else if (user.role === 'PARENT') {
                this.router.navigate(['/parent-dashboard']);
              } else {
                // A fallback to the home page
                this.router.navigate(['/home']);
              }
            }
          });
        },
        error: (err) => console.error('Login failed:', err)
      });
    }
  }
}