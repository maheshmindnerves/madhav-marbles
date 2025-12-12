import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../services/product-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { ResultModel } from '../../models/result.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-add-prodcut',
  imports: [MatButtonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './add-prodcut.html',
  styleUrl: './add-prodcut.scss'
})
export class AddProdcut {
  productForm!: FormGroup;
  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef);
  private snackBar = inject(SnackBarService);
  private productService = inject(ProductService);
  private loader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  onClickConfirm(): void {
    if (this.productForm.valid) {
      const payload = {
        item_Code: this.productForm.value.code,
        name: this.productForm.value.name,
        category_id: 0,
        isactive: false,
        flag: "Add",
        id: 0,
        category_desc: "",
        category_name: this.productForm.value.category
      }
      this.loader.start();
      this.productService.addOrUpdateProduct(payload).subscribe({
        next: (res: ResultModel) => {
          this.loader.stop();
          if (res.isSuccess) {
            this.dialogRef.close(payload);
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
    } else {
      this.productForm.markAllAsTouched();
    }
  }

}
