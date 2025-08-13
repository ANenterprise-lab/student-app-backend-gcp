import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api, Subject } from '../../services/api';

@Component({
  selector: 'app-subject-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './subject-list.html',
})
export class SubjectList implements OnInit {
  subjects: Subject[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }
}