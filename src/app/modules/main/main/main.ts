import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrl: './main.scss',
  standalone: false
})
export class Main {
  private router = inject(Router);
  private authService = inject(AuthService);
  ngOnInit(): void {}

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}
