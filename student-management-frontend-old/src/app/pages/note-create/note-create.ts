import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api, Course } from '../../services/api';

@Component({
  selector: 'app-note-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './note-create.html',
})
export class NoteCreate implements OnInit {
  noteForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    course: new FormControl(null, Validators.required),
  });
  courses: Course[] = [];

  constructor(private apiService: Api, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      this.apiService.createNote(this.noteForm.value).subscribe(() => {
        this.router.navigate(['/notes']);
      });
    }
  }
}