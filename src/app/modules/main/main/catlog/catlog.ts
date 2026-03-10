import { Component, computed, inject, signal } from '@angular/core';
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
  imports: [ReactiveFormsModule],
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
  /*   readonly isSubmit = signal(false); */
  /*  readonly isOpenFilter = signal(false); */
  /*   readonly holdItem = signal<any[]>([]); */
  /*   otpForm!: FormGroup; */
  protected readonly items = signal<ProductList[]>([]);

  ngOnInit(): void {
    this.loader.start();
    this.crService.GetRequestProductList().subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          this.items.set(res.data);
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

  openDialog(item: ProductList): void {
    console.log('111111111111')
    if (item.isOpen) {
      const obj = this.subCatlog.filter((x) => x.Parent_Product_id === item.productId + '');
      this.dialog.open(CategoryDetails, { data: { title: item.name + item.item_Code, data: obj }, width: '90vw', minWidth: '90vw', maxHeight: '90vh' });
    } else {
      this.loader.start();
      this.crService.GetRequestProductDetail(item.productId).subscribe({
        next: (res: ResultModel) => {
          if (res.isSuccess && res.data.length > 0) {
            item.isOpen = true;
            this.dialog.open(CategoryDetails, { data: { title: item.name + item.item_Code, data: res.data }, width: '90vw', minWidth: '90vw', maxHeight: '90vh' });
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

}
