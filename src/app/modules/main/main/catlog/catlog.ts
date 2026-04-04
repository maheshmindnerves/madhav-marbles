import { Component, computed, HostListener, inject, NgZone, signal } from '@angular/core';
import { CategoryDetails } from '../../../../shared/modals/category-details/category-details';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Otp } from '../../../../shared/modals/otp/otp';
import { CustomerRequestService } from '../../../../services/customer-request-service';
import { ResultModel } from '../../../../shared/models/result.model';
import { SnackBarService } from '../../../../services/snack-bar-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ZoomImage } from '../../../../shared/modals/zoom-image/zoom-image';
import { HoldCatlog } from '../../../../shared/modals/hold-catlog/hold-catlog';
import { SendEmail } from '../../../../shared/modals/send-email/send-email';
import { Filter } from "../../../../shared/components/filter/filter";
import { CatlogDetails } from '../../../../shared/modals/catlog-details/catlog-details';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export interface ProductList {
  productId: number;
  company_Id: number;
  name: string;
  category_id: number;
  subCategory_Id: number;
  hold: boolean;
  sampleOrder: boolean;
  item_Code: string;
  category_Name: string;
  subCategory_name: string;
  image_sr_no: number;
  image_Path: string;
  address: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-catlog',
  imports: [ReactiveFormsModule, Filter],
  templateUrl: './catlog.html',
  styleUrl: './catlog.scss'
})
export class Catlog {
  readonly fb = inject(FormBuilder);
  readonly crService = inject(CustomerRequestService);
  private snackBar = inject(SnackBarService);
  private loader = inject(NgxUiLoaderService);
  readonly dialog = inject(MatDialog);
  subCatlog: any[] = [];
  isButtonShow: boolean = false;



  protected readonly items = signal<ProductList[]>([]);
  protected readonly swiperImages = signal<any[]>([
    "https://www.madhavmarbles.com/wp-content/uploads/2021/02/banner-3.jpg",
    "https://www.madhavmarbles.com/wp-content/uploads/2021/01/MMGL-feature.jpg",
    "https://www.madhavmarbles.com/wp-content/uploads/2026/03/ChatGPT-Image-Mar-2-2026-03_36_34-PM.png",
    "https://www.madhavmarbles.com/wp-content/uploads/2024/07/colonial-white-on-flooring.png",
    "https://www.madhavmarbles.com/wp-content/uploads/2021/10/21st-Oct-blog-feature-750x350.jpg",
  ]);


  ngOnInit(): void {
    this.loader.start();
    this.items.set([]);
    this.crService.GetRequestProductList().subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          this.items.set(res.data);
          /* res.data.forEach((o) => {
            this.items.update(arr => [
              ...arr,
              o
            ]);
          }); */
        } else {
          this.snackBar.error('No data found.');
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

  ngAfterViewInit(): void {
    new Swiper('.mySwiper', {
      loop: false,

      slidesPerView: 1,   // 🔥 multiple images visible
      spaceBetween: 20,
      speed: 4000,
      autoplay: {
        delay: 3000,
        disableOnInteraction: true,
        /*    pauseOnMouseEnter: true */
      },

      //   autoplay: false,

      /* navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }, */

      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },

      breakpoints: {
        320: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 1 }
      }
    });

  }

  openDialog(item: ProductList): void {
    if (item.isOpen) {
      const obj = this.subCatlog.filter((x) => Number(x.parent_product_id) === Number(item.productId));
      const dialogRef = this.dialog.open(CatlogDetails, { data: { title: item.name + item.item_Code, data: obj }, width: '90vw', minWidth: '90vw', maxHeight: '90vh', disableClose: true });
      dialogRef.afterClosed().subscribe(() => {
        const data: any[] = this.subCatlog.filter(item => item.hold || item.sampleOrder);
        if (data.length > 0) {
          this.isButtonShow = true;
        } else {
          this.isButtonShow = false;
        }
      });
    } else {
      this.loader.start();
      this.crService.GetRequestProductDetail(item.productId).subscribe({
        next: (res: ResultModel) => {
          if (res.isSuccess && res.data.length > 0) {
            item.isOpen = true;
            const dialogRef = this.dialog.open(CatlogDetails, { data: { title: item.name + item.item_Code, data: res.data }, width: '90vw', minWidth: '90vw', maxHeight: '90vh', disableClose: true });
            dialogRef.afterClosed().subscribe(() => {
              const data: any[] = this.subCatlog.filter(item => item.hold || item.sampleOrder);
              if (data.length > 0) {
                this.isButtonShow = true;
              } else {
                this.isButtonShow = false;
              }
            });
            res.data.forEach((o) => {
              o.category_Name = item.category_Name;
              o.subCategory_name = item.subCategory_name;
              this.subCatlog.push(o);
            });
          } else {
            this.snackBar.error('No data found.');
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
  }

  submitRequest(): void {
    const data: any[] = this.subCatlog.filter(item => item.hold || item.sampleOrder);
    if (data.length > 0) {
      this.dialog.open(HoldCatlog, {
        width: '76vw', maxWidth: '75vw', height: '80vh', data
      });
      //this.isSubmit.set(true);
      /*  this.otpForm = this.fb.group({
         name: ['', Validators.required],
         city: ['', Validators.required],
         state: ['', Validators.required],
         country: ['', Validators.required],
         email: ['', [Validators.required, Validators.email]],
         mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
       }); */
    } else {
      this.snackBar.error('Please hold sample');
    }
  }

  /*   goToCatlog(): void {
      this.isSubmit.set(false);
    } */

  /*   onSubmit(): void {
      
    } */

  /*   closeNav(): void {
      this.isOpenFilter.set(false);
        (document.getElementById("mySidebar") as HTMLElement).style.width = "0";
        (document.getElementById("main") as HTMLElement).style.marginLeft = "-11px";
    } */

  onClickImage(imageItem: any): void {
    const dialogRef = this.dialog.open(ZoomImage, {
      width: '98vw', maxWidth: '98vw', height: '98vh',
      data: imageItem.image_Path
    });
  }

  onClickEmail(): void {
    const dialogRef = this.dialog.open(SendEmail, { width: '480px', data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
