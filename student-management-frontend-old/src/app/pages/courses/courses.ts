import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Import RouterLink
import { Api, Course } from '../../services/api';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, RouterLink], // Add RouterLink here
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  courses: Course[] = [];

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }
    deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.apiService.deleteCourse(id).subscribe(() => {
        // Refresh the list after deleting
        this.courses = this.courses.filter(c => c.id !== id);
      });
    }
  }
}
