import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { StorageService } from '../../../services/storage-service';
import { MatDialog } from '@angular/material/dialog';
import { UserDetails } from '../../../shared/modals/user-details/user-details';

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
  private dialog = inject(MatDialog);
  userName = signal<string>('');

  ngOnInit(): void {
    this.userName.set(this.storage.getItem('userName') || '');
  }

  openProfile(): void {
    this.dialog.open(UserDetails, {
      width: '450px',
      autoFocus: false
    });
  }

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}
