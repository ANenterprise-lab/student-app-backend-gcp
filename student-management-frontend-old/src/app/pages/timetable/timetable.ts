import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api, Timetable } from '../../services/api';

@Component({
  selector: 'app-timetable',
  imports: [CommonModule, RouterLink],
  templateUrl: './timetable.html',
  styleUrl: './timetable.css'
})
export class TimetableComponent implements OnInit {
  // Rename this property to match the HTML
  timetables: Timetable[] = [];

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    // Correct the method name here
    this.apiService.getTimetables().subscribe(data => {
      this.timetables = data;
    });
  }
}