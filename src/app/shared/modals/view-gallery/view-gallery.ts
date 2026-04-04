import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { ZoomImage } from '../zoom-image/zoom-image';

@Component({
  selector: 'app-view-gallery',
  imports: [MatDialogModule],
  templateUrl: './view-gallery.html',
  styleUrl: './view-gallery.scss',
})
export class ViewGallery {
  items = signal<any[]>([]);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private timer!: Subscription;
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.items.set(this.data);
  }

  ngAfterViewInit(): void {
    this.timer = interval(3000).subscribe(() => {
      (document.getElementsByClassName('carousel-control-next')[0] as HTMLElement).click();
    });
  }

  /* deleteItem(imageItem: any): void {
    this.loader.start();
    this.productService.DeleteImageFromGallery(imageItem.id).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess) {
          this.snackBar.success(res.data[0].Result);
          this.items.update(list => list.filter(item => item.id !== imageItem.id));
        } else {
          this.snackBar.error(res.message);
        }
      },
      error: (err) => {
        console.error('Error:', err);
      },
      complete: () => {
        this.loader.stop();
      }
    });
  } */

  onClickImage(imageItem: any): void {
    const dialogRef = this.dialog.open(ZoomImage, {
      width: '98vw', maxWidth: '98vw', height: '98vh',
      data: imageItem.Image_Path
    });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();   // 🔥 prevents memory leak
  }
}
