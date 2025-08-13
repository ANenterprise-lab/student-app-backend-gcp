import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Api, User } from '../../services/api';

@Component({
  selector: 'app-invoice-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-create.html',
})
export class InvoiceCreate implements OnInit {
  invoiceForm: FormGroup;
  students: User[] = [];

  constructor(private apiService: Api, private router: Router) {
    this.invoiceForm = new FormGroup({
      student: new FormControl(null, Validators.required),
      title: new FormControl('', Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      due_date: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.apiService.getUsers().subscribe(users => {
      this.students = users.filter(u => u.role === 'STUDENT');
    });
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      this.apiService.createInvoice(this.invoiceForm.value).subscribe({
        next: () => this.router.navigate(['/invoices']),
        error: (err) => console.error('Failed to create invoice:', err)
      });
    }
  }
}