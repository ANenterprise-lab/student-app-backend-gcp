import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api, Course } from '../../services/api';

@Component({
  selector: 'app-assignment-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assignment-create.html',
  styleUrl: './assignment-create.css'
})
export class AssignmentCreate implements OnInit {
  assignmentForm = new FormGroup({
    title: new FormControl('', Validators.required),
    course: new FormControl(null, Validators.required),
    due_date: new FormControl('', Validators.required),
    description: new FormControl('')
  });
  courses: Course[] = [];

  constructor(private apiService: Api, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  onSubmit(): void {
    if (this.assignmentForm.valid) {
      this.apiService.createAssignment(this.assignmentForm.value).subscribe({
        next: () => {
          console.log('Assignment created successfully!');
          this.router.navigate(['/assignments']);
        },
        error: (err) => console.error('Failed to create assignment:', err)
      });
    }
  }
}