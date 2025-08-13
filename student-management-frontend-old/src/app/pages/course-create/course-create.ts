import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-course-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-create.html',
  styleUrl: './course-create.css'
})
export class CourseCreate {
  courseForm = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    credit_hours: new FormControl(null, [Validators.required, Validators.min(1)]),
    description: new FormControl('')
  });

  constructor(private apiService: Api, private router: Router) {}

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.apiService.createCourse(this.courseForm.value).subscribe({
        next: () => {
          console.log('Course created successfully!');
          this.router.navigate(['/courses']); // Redirect to the course list on success
        },
        error: (err) => console.error('Failed to create course:', err)
      });
    }
  }
}