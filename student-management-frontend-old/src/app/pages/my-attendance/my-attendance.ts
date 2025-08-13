import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, Attendance } from '../../services/api';

@Component({
  selector: 'app-my-attendance',
  imports: [CommonModule],
  templateUrl: './my-attendance.html',
})
export class MyAttendance implements OnInit {
  attendanceRecords: Attendance[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getMyAttendance().subscribe(data => {
      this.attendanceRecords = data;
    });
  }
}