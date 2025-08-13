import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api, User } from '../../services/api';

@Component({
  selector: 'app-class-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './class-create.html',
})
export class ClassCreate implements OnInit {
  classForm = new FormGroup({
    name: new FormControl('', Validators.required),
    section: new FormControl('', Validators.required),
    class_teacher: new FormControl(null)
  });

  teachers: User[] = [];

  constructor(private apiService: Api, private router: Router) {}

  ngOnInit(): void {
    // Fetch all users to find the teachers for the dropdown
    this.apiService.getUsers().subscribe(users => {
      this.teachers = users.filter(user => user.role === 'TEACHER');
    });
  }

  onSubmit(): void {
    if (this.classForm.valid) {
      this.apiService.createClass(this.classForm.value).subscribe({
        next: () => {
          console.log('Class created successfully!');
          this.router.navigate(['/classes']);
        },
        error: (err) => console.error('Failed to create class:', err)
      });
    }
  }
}