import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-zoom-image',
  imports: [MatDialogModule],
  templateUrl: './zoom-image.html',
  styleUrl: './zoom-image.scss',
})
export class ZoomImage {
  readonly data = inject<any>(MAT_DIALOG_DATA);
}
