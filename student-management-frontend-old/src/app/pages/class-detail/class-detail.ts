import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Api, SchoolClass } from '../../services/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-class-detail',
  // Remove RouterLink from here
  imports: [CommonModule],
  templateUrl: './class-detail.html',
})
export class ClassDetail implements OnInit {
  classDetail$: Observable<SchoolClass> | undefined;

  constructor(
    private apiService: Api,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const classId = this.route.snapshot.paramMap.get('id');
    if (classId) {
      this.classDetail$ = this.apiService.getClass(+classId);
    }
  }
}