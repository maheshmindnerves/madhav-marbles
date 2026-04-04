import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private router = inject(Router);
  protected readonly items = signal([
    { id: 1, name: 'Customer Requests', imageName: 'request', value: 24, url: '/main/request' },
    { id: 2, name: 'Product Catlog', imageName: 'catlog', value: 34, url: '/main/product-catlog' },
    { id: 3, name: 'Finished Product Entry', imageName: 'entry', value: 25 },
    { id: 4, name: 'Add Location', imageName: 'location', value: 40 },
    { id: 6, name: 'Reports', imageName: 'reports', value: 33 },
    { id: 7, name: 'User Management', imageName: 'management', value: 30 },
    { id: 8, name: 'Sales Requests', imageName: 'request', value: 30, url: '/main/sales-request' },
  ]);

  onClickCard(item: any): void {
    this.router.navigate([item.url]);
  }
}
