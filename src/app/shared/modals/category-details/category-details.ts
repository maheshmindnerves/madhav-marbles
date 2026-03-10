import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ZoomImage } from '../zoom-image/zoom-image';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
declare var bootstrap: any;

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
  hold: boolean;
  sampleOrder: boolean;
}

export interface ProductDetails {
  title: string;
  data: ProductData[];
}

@Component({
  selector: 'app-category-details',
  imports: [MatDialogModule, FormsModule, MatIconModule, MatMenuModule, MatButtonModule],
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

  showPopover(event: any, item: ProductData) {

    const el = event.target;

    const content = `
    <div>
       ${item.Specification}
    </div>
  `;

    let popover = bootstrap.Popover.getInstance(el);

    if (!popover) {
      popover = new bootstrap.Popover(el, {
        trigger: 'manual',
        placement: 'auto',
        html: true,
        content: content
      });
    }

    popover.setContent({
      '.popover-header': 'Specification',
      '.popover-body': content
    });

    popover.show();
  }

  hidePopover(event: any) {
    const popover = bootstrap.Popover.getInstance(event.target);
     if (popover) {
       popover.hide();
     }
  }
}
