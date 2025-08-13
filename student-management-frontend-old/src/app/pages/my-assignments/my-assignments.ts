import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, Assignment } from '../../services/api';

@Component({
  selector: 'app-my-assignments',
  imports: [CommonModule],
  templateUrl: './my-assignments.html',
})
export class MyAssignments implements OnInit {
  assignments: Assignment[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getMyAssignments().subscribe(data => {
      this.assignments = data;
    });
  }
}