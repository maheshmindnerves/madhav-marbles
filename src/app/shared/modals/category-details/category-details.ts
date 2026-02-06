import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ZoomImage } from '../zoom-image/zoom-image';

export interface ProductData {
  Dimension: string;
  Image_Description: string;
  Image_Path: string;
  Image_Sr_No: string;
  Parent_Product_id: string;
  Product_Specification_id: string;
  Specification: string;
  Thickness: string;
  color: string;
  id: string;
  selling_price: string;
}

export interface ProductDetails {
  title: string;
  data: ProductData[];   // 👈 make it array
}

@Component({
  selector: 'app-category-details',
  imports: [MatDialogModule],
  templateUrl: './category-details.html',
  styleUrl: './category-details.scss'
})
export class CategoryDetails {
  readonly categroyDetails = inject<ProductDetails>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  onClickImage(imageItem: any): void {
    const dialogRef = this.dialog.open(ZoomImage, {
      width: '98vw', maxWidth: '98vw', height: '98vh',
      data: imageItem.Image_Path
    });
  }

}
