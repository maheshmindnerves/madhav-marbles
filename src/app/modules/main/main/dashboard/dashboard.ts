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
    { id: 1, name: 'Customer Requests', imageName: 'request', value: 24 },
    { id: 2, name: 'Product Catalog', imageName: 'catalog', value: 34 },
    { id: 3, name: 'Finished Product Entry', imageName: 'entry', value: 25 },
    { id: 4, name: 'Add Location', imageName: 'location', value: 40 },
    { id: 6, name: 'Reports', imageName: 'reports', value: 33 },
    { id: 7, name: 'User Management', imageName: 'management', value: 30 }
  ]);


  onClickCard(item: any): void {
    this.router.navigate(['/main/product-catalog']);
  }
}
