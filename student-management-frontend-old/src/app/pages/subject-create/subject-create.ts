import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-subject-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subject-create.html',
})
export class SubjectCreate {
  subjectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    description: new FormControl(''),
    syllabus: new FormControl(''),
  });
  constructor(private apiService: Api, private router: Router) {}
  onSubmit(): void {
    if (this.subjectForm.valid) {
      this.apiService.createSubject(this.subjectForm.value).subscribe(() => {
        this.router.navigate(['/subjects']);
      });
    }
  }
}