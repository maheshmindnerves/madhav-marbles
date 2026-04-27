import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ZoomImage } from '../zoom-image/zoom-image';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import Swiper from 'swiper';

@Component({
  selector: 'app-category-details',
  imports: [MatDialogModule, FormsModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './category-details.html',
  styleUrl: './category-details.scss'
})
export class CategoryDetails {
  readonly categroyDetails = inject<ProductDetails>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.categroyDetails.data.forEach(element => {
      element.tempImage = element.product_Images[0].image_Path;
      element.tempDesc = element.product_Images[0].image_description;
    });
  }

  ngAfterViewInit(): void {
    new Swiper('.mySwiper', {
      loop: false,

      slidesPerView: 3,   // 🔥 multiple images visible
      spaceBetween: 20,

      /*  autoplay: {
         delay: 20000,
         disableOnInteraction: true,
         pauseOnMouseEnter: true
       }, */

      autoplay: false,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },

      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },

      breakpoints: {
        320: { slidesPerView: 4 },
        576: { slidesPerView: 4 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 4 }
      }
    });
  }

  onClickImage(imageItem: any): void {
    const dialogRef = this.dialog.open(ZoomImage, {
      width: '98vw', maxWidth: '98vw', height: '98vh',
      data: imageItem.Image_Path
    });
  }
  /* 
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
    } */

  onClickDefultImage(data: ProductData, base64: string, desc: string): void {
    data.tempImage = base64;
    data.tempDesc = desc;
    //    element.tempDesc = element.product_Images[0].image_description;

  }
  openInfo(item: ProductData) {
    item.isOpenAccordion = !item.isOpenAccordion;
  }
}

export interface ProductData {
  applications: string;
  sTotalArea: string;
  sWidth: string;
  sLength: string;
  sFinishType: string;
  pattern: string;
  sPriceCategory: string;
  surfaceQuality: string;
  origin: string;
  isOpenAccordion: boolean;
  tempImage: string;
  tempDesc: string;
  Dimension: string;
  Image_Description: string;
  Image_Path: string;
  Image_Sr_No: string;
  parent_product_id: string;
  product_Specification_id: string;
  specification: string;
  Thickness: string;
  color: string;
  id: string;
  selling_price: string;
  isample: boolean;
  isHold: boolean;
  product_Images: any[]
}

export interface ProductDetails {
  title: string;
  data: ProductData[];
}
