import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api, SchoolClass } from '../../services/api';

@Component({
  selector: 'app-class-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './class-list.html',
})
export class ClassList implements OnInit {
  classes: SchoolClass[] = [];

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getClasses().subscribe(data => {
      this.classes = data;
    });
  }
}