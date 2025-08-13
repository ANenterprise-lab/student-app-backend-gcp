import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, DailyNote } from '../../services/api';

@Component({
  selector: 'app-my-notes',
  imports: [CommonModule],
  templateUrl: './my-notes.html',
})
export class MyNotes implements OnInit {
  notes: DailyNote[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getMyNotes().subscribe(data => {
      this.notes = data;
    });
  }
}