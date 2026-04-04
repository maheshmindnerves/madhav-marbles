import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { AddProdcut } from '../../../../../shared/modals/add-prodcut/add-prodcut';
import { Router } from '@angular/router';
import { EditProdcut } from '../../../../../shared/modals/edit-prodcut/edit-prodcut';
import { ProductService } from '../../../../../services/product-service';
import { SnackBarService } from '../../../../../services/snack-bar-service';
import { ResultModel } from '../../../../../shared/models/result.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface product {
  company_Name: string;
  id: number;
  name: string;
  isactive: boolean;
  flag: string;
  category_name: string;
  category_id: string;
  category_desc: string;
  item_Code: string;
  subCategory_name: string;
}


@Component({
  selector: 'app-prodcut-catlog',
  imports: [MatIconModule],
  templateUrl: './prodcut-catlog.html',
  styleUrl: './prodcut-catlog.scss'
})
export class ProdcutCatlog {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);
  private productService = inject(ProductService);
  private loader = inject(NgxUiLoaderService);
  items = signal<product[]>([]);

  ngOnInit(): void {
    this.getProducts();

  }

  addProduct(): void {
    const dialogRef = this.dialog.open(AddProdcut, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nextIndex = this.items().length + 1;
        result.id = nextIndex;
        this.items.update(arr => [...arr, result]);
      }
    });
  }

  onClickCard(item: any): void {

  }

  getProducts(): void {
    this.loader.start();
    this.productService.getProducts().subscribe({
      next: (res: ResultModel) => {
        this.loader.stop();
        if (res.isSuccess) {
          this.items.set(res.data);
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

  onClickEdit(item: any): void {
    const dialogRef = this.dialog.open(EditProdcut, {
      width: '650px',
      height: '80vh',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        /*    const nextIndex = this.items().length + 1;
           result.id = nextIndex;
           this.items.update(arr => [...arr, result]); */
        this.getProducts();
      }
    });
  }

  onClickSpecification(item: any): void {
    this.router.navigate(['/main/specificaiton', item.id, item.name]);
  }

  back(): void {
    this.router.navigate(['/main/dashboard']);
  }
}
