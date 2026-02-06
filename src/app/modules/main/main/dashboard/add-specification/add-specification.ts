import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../../../../services/product-service';
import { SnackBarService } from '../../../../../services/snack-bar-service';
import { ResultModel } from '../../../../../shared/models/result.model';
import { ProductGallary } from '../../../../../shared/modals/product-gallary/product-gallary';
import { ViewGallery } from '../../../../../shared/modals/view-gallery/view-gallery';
export interface specificaiton {
  id: number;
  name: string;
  Color: string;
  Dimension: string;
  Parent_Product_id: number;
  Specification: string;
  Thickness: string;
}

@Component({
  selector: 'app-add-specification',
  imports: [MatIconModule],
  templateUrl: './add-specification.html',
  styleUrl: './add-specification.scss'
})
export class AddSpecification {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);
  private productService = inject(ProductService);
  private loader = inject(NgxUiLoaderService);
  private route = inject(ActivatedRoute);
  items = signal<specificaiton[]>([]);

  ngOnInit(): void {
    this.loader.start();
    this.productService.GetProductSpecification(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: (res: ResultModel) => {
        this.loader.stop();
        if (res.isSuccess) {
          this.items.set(
            res.data.map((item: any) => ({
              ...item,
              Parent_Product_id: Number(this.route.snapshot.paramMap.get('id')),
              name: this.route.snapshot.paramMap.get('name')
            })));
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

  onClickProductGallary(item: specificaiton): void {
    const dialogRef = this.dialog.open(ProductGallary, {
      width: '450px',
      data: item
    });
  }

  onClickViewGallery(item: specificaiton): void {
    this.loader.start();
    this.productService.GetProductGallery({ parent_Product_Id: Number(item.Parent_Product_id), product_Specification_Id: Number(item.id) }).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          const dialogRef = this.dialog.open(ViewGallery, {
            width: '450px',
            data: res.data
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

  back(): void {
    this.router.navigate(['/main/product-catlog']);
  }
}
