import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';

@Component({
  selector: 'app-parent-dashboard',
  imports: [CommonModule],
  templateUrl: './parent-dashboard.html',
})
export class ParentDashboard implements OnInit {
  dashboardData: any = null;

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getParentDashboard().subscribe(data => {
      this.dashboardData = data;
    });
  }
}