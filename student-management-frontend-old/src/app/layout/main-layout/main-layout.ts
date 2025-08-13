import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { Api, User } from '../../services/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor(private apiService: Api, private router: Router) {
    this.isAuthenticated$ = this.apiService.isAuthenticated();
    this.currentUser$ = this.apiService.currentUser.asObservable();
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/home']);
  }
}