import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Import RouterLink
import { Api, User } from '../../services/api';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, RouterLink], // 2. Add RouterLink here
  templateUrl: './user-management.html',
})
export class UserManagement implements OnInit {
  users: User[] = [];
  roles: string[] = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']; // Available roles

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  onRoleChange(event: Event, user: User): void {
    const newRole = (event.target as HTMLSelectElement).value;
    this.apiService.updateUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        console.log(`User ${updatedUser.username} role updated to ${updatedUser.role}`);
        // Update the local user object to reflect the change immediately
        user.role = updatedUser.role;
      },
      error: (err) => console.error('Failed to update role:', err)
    });
  }
}