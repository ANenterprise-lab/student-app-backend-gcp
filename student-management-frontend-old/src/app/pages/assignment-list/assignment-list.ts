import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api, Assignment } from '../../services/api';

@Component({
  selector: 'app-assignment-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './assignment-list.html',
  styleUrl: './assignment-list.css'
})
export class AssignmentList implements OnInit {
  assignments: Assignment[] = [];

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getAssignments().subscribe(data => {
      this.assignments = data;
    });
  }
}