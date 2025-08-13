import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api, Course } from '../../services/api'; // Import Course interface

@Component({
  selector: 'app-timetable-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './timetable-create.html',
  styleUrl: './timetable-create.css'
})
export class TimetableCreate implements OnInit {
  timetableForm = new FormGroup({
    course: new FormControl(null, Validators.required),
    day_of_week: new FormControl('', Validators.required),
    start_time: new FormControl('', Validators.required),
    end_time: new FormControl('', Validators.required),
    room_number: new FormControl(''),
  });

  // To store the list of courses for the dropdown
  courses: Course[] = [];

  constructor(private apiService: Api, private router: Router) {}

  ngOnInit(): void {
    // Fetch courses when the component loads
    this.apiService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  onSubmit(): void {
    if (this.timetableForm.valid) {
      this.apiService.createTimetableEntry(this.timetableForm.value).subscribe({
        next: () => {
          console.log('Timetable entry created successfully!');
          this.router.navigate(['/timetable']); // Redirect on success
        },
        error: (err) => console.error('Failed to create entry:', err)
      });
    }
  }
}