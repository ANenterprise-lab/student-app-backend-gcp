import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, Attendance } from '../../services/api';

@Component({
  selector: 'app-attendance-viewer',
  imports: [CommonModule],
  templateUrl: './attendance-viewer.html',
})
export class AttendanceViewer implements OnInit {
  attendanceRecords: Attendance[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getAttendance().subscribe(data => {
      this.attendanceRecords = data;
    });
  }
}