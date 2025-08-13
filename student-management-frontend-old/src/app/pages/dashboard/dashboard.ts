import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Import RouterLink
import { Api, User, Assignment } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink], // 2. Add RouterLink here
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  users: User[] = [];
  assignments: Assignment[] = [];

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getUsers().subscribe(data => {
      this.users = data;
    });

    this.apiService.getAssignments().subscribe(data => {
      this.assignments = data;
    });
  }
}