import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.html',
})
export class TeacherDashboard implements OnInit {
  dashboardData: any = null;

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getTeacherDashboard().subscribe(data => {
      this.dashboardData = data;
    });
  }
}