import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { StorageService } from '../../../services/storage-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrl: './main.scss',
  standalone: false
})
export class Main {
  private router = inject(Router);
  private authService = inject(AuthService);
  private storage = inject(StorageService);
  userName = signal<string>('');

  ngOnInit(): void {
    this.userName.set(this.storage.getItem('userName') || '');
  }

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}
