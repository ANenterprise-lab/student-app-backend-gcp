import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
})
export class StudentDashboard implements OnInit {
  dashboardData: any = null;
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getStudentDashboard().subscribe(data => {
      this.dashboardData = data;
    });
  }
}