import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, Assignment } from '../../services/api';

@Component({
  selector: 'app-my-grades',
  imports: [CommonModule],
  templateUrl: './my-grades.html',
})
export class MyGrades implements OnInit {
  assignments: Assignment[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getMyAssignments().subscribe(data => {
      // We only want to show assignments that have been graded
      this.assignments = data.filter(a => a.grade);
    });
  }
}