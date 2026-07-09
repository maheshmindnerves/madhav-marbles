import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../../../services/storage-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  imports: [MatDialogModule, CommonModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {
  private storage = inject(StorageService);
  readonly dialogRef = inject(MatDialogRef);

  userName = signal<string>('');
  userEmail = signal<string>('');
  userMobile = signal<string>('');
  userAddress = signal<string>('');

  ngOnInit(): void {
    this.userName.set(this.storage.getItem('userName') || 'N/A');
    this.userEmail.set(this.storage.getItem('userEmail') || 'N/A');
    this.userMobile.set(this.storage.getItem('userMobile') || 'N/A');
    this.userAddress.set(this.storage.getItem('userAddress') || 'N/A');
  }

  close(): void {
    this.dialogRef.close();
  }
}
