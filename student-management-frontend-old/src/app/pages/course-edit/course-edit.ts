import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-course-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-edit.html',
})
export class CourseEdit implements OnInit {
  courseForm: FormGroup;
  courseId!: number;

  constructor(
    private apiService: Api,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseForm = new FormGroup({
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      credit_hours: new FormControl(null, Validators.required),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.apiService.getCourse(this.courseId).subscribe(data => {
      this.courseForm.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.apiService.updateCourse(this.courseId, this.courseForm.value).subscribe(() => {
        this.router.navigate(['/courses']);
      });
    }
  }
}