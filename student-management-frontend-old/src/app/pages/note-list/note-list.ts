import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api, DailyNote } from '../../services/api';

@Component({
  selector: 'app-note-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './note-list.html',
})
export class NoteList implements OnInit {
  notes: DailyNote[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getNotes().subscribe(data => {
      this.notes = data;
    });
  }
}