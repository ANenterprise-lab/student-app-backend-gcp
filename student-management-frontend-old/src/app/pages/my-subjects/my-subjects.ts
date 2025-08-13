import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, Subject } from '../../services/api';

@Component({
  selector: 'app-my-subjects',
  imports: [CommonModule],
  templateUrl: './my-subjects.html',
})
export class MySubjects implements OnInit {
  subjects: Subject[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }
}