import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, Course } from '../../services/api';

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule],
  templateUrl: './my-courses.html',
})
export class MyCourses implements OnInit {
  courses: Course[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getMyCourses().subscribe(data => {
      this.courses = data;
    });
  }
}