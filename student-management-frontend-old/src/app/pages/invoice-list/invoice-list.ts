import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api, Invoice } from '../../services/api';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './invoice-list.html',
})
export class InvoiceList implements OnInit {
  invoices: Invoice[] = [];
  constructor(private apiService: Api) {}
  ngOnInit(): void {
    this.apiService.getInvoices().subscribe(data => {
      this.invoices = data;
    });
  }
}