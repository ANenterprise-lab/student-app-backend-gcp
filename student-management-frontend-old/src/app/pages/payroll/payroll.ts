import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api, Payroll, User } from '../../services/api';

@Component({
  selector: 'app-payroll',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payroll.html',
})
export class PayrollComponent implements OnInit {
  payrollForm: FormGroup;
  payrolls: Payroll[] = [];
  teachers: User[] = [];

  constructor(private apiService: Api) {
    this.payrollForm = new FormGroup({
      teacher: new FormControl(null, Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      pay_date: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadPayrolls();
    this.apiService.getUsers().subscribe(users => {
      this.teachers = users.filter(u => u.role === 'TEACHER');
    });
  }

  loadPayrolls(): void {
    this.apiService.getPayrolls().subscribe(data => this.payrolls = data);
  }

  onSubmit(): void {
    if (this.payrollForm.valid) {
      this.apiService.createPayroll(this.payrollForm.value).subscribe({
        next: () => {
          console.log('Payroll created successfully!');
          this.loadPayrolls(); // Refresh the list
          this.payrollForm.reset();
        },
        error: (err) => console.error('Failed to create payroll:', err)
      });
    }
  }
}