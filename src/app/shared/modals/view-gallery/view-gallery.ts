import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../../services/product-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ResultModel } from '../../models/result.model';
import { interval, Subscription } from 'rxjs';
import { MatIcon } from "@angular/material/icon";
import { ZoomImage } from '../zoom-image/zoom-image';

@Component({
  selector: 'app-view-gallery',
  imports: [MatDialogModule, MatIcon],
  templateUrl: './view-gallery.html',
  styleUrl: './view-gallery.scss',
})
export class ViewGallery {
  private snackBar = inject(SnackBarService);
  private productService = inject(ProductService);
  private loader = inject(NgxUiLoaderService);
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

  deleteItem(imageItem: any): void {
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
  }

  onClickImage(imageItem: any): void {
    const dialogRef = this.dialog.open(ZoomImage, {
      width: '450px',
      data: imageItem
    });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();   // 🔥 prevents memory leak
  }
}
