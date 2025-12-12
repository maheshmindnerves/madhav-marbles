import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  private router = inject(Router);

  goToCatlog(): void {
    this.router.navigate(['/main/catalog']);
  }
}
