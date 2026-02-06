import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarService } from '../../../services/snack-bar-service';
import { ProductService } from '../../../services/product-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResultModel } from '../../models/result.model';
import { ZoomImage } from '../zoom-image/zoom-image';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ProductData {
  Image_Description: string;
  Image_Path: string;
  Image_Sr_No: string;
  Parent_Product_id: string;
  Product_Specification_id: string;
  bactive: string;
  id: string;
}


@Component({
  selector: 'app-product-gallary',
  imports: [MatDialogModule, MatIconModule, ReactiveFormsModule, CommonModule, MatTooltipModule],
  templateUrl: './product-gallary.html',
  styleUrl: './product-gallary.scss',
})
export class ProductGallary {

  private snackBar = inject(SnackBarService);
  private productService = inject(ProductService);
  private loader = inject(NgxUiLoaderService);
  items = signal<any[]>([]);
  specification = new FormControl('', Validators.required);
  selectedFile = signal<File | null>(null);
  imageSrc: any = null;
  readonly data = inject<ProductData>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.GetProductGallery();
  }

  GetProductGallery(): void {
    this.loader.start();
    this.productService.GetProductGallery({ parent_Product_Id: Number(this.data.Parent_Product_id), product_Specification_Id: Number(this.data.id) }).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess) {
          this.items.set(res.data);
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

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  imageClear(): void {
    this.imageSrc = null;
    this.selectedFile.set(null);
    if (this.imageSrc === null) {
      this.snackBar.error('Please select image.');
      return;
    }
  }

  uploadImage(): void {
    if (this.imageSrc === null) {
      this.snackBar.error('Please select image.');
      return;
    }
    if (this.specification.value === '') {
      this.snackBar.error('Please enter image specification.');
      return;
    }


    const file = this.selectedFile();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('flag', 'Add');
    formData.append('id', '0');
    formData.append('parent_Product_id', this.data.Parent_Product_id);
    formData.append('product_Specification_id', this.data.id);
    formData.append('image_sr_no', this.items().length === 0 ? '1' : '0');
    formData.append('image_Path', 'null');
    formData.append('image_Description', this.specification.value || '');
    formData.append('isactive', 'true');

    this.loader.start();
    this.productService.AddorUpdateProductGalley(formData).subscribe({
      next: (res: ResultModel) => {
        this.loader.stop();
        if (res.isSuccess) {
          //  this.dialogRef.close(payload);
          this.GetProductGallery();
          this.specification.reset();
          this.imageSrc = null;
          this.snackBar.success(res.data[0].Result)
        } else {
          this.snackBar.error(res.message);
        }
      },
      error: (err) => {
        this.loader.stop();
        console.error('Error:', err);
      }
    });
  }

  deleteItem(imageItem: ProductData): void {
    if (imageItem.Image_Sr_No === '1') {
      this.snackBar.error('Please set another banner image then remove');
      return;
    }
    this.loader.start();
    this.productService.DeleteImageFromGallery(Number(imageItem.id)).subscribe({
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

  onClickStarMark(imageItem: ProductData): void {
    this.loader.start();
    this.productService.MarkImageAsCoverpAge(Number(imageItem.id)).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess) {
          this.snackBar.success(res.data[0].Result);
          this.items.update(list => list.filter((item) => {
            if (imageItem.id === item.id) {
              item.bIsAppylyOnCoverPage = "True";
            } else {
              item.bIsAppylyOnCoverPage = "False";
            }
            return item;
          }));
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
      width: '98vw', maxWidth: '98vw', height: '98vh',
      data: imageItem.Image_Path
    });
  }
}
