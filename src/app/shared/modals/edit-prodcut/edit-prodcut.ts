import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../../services/product-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { ResultModel } from '../../models/result.model';

@Component({
  selector: 'app-edit-prodcut',
  imports: [MatButtonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './edit-prodcut.html',
  styleUrl: './edit-prodcut.scss'
})
export class EditProdcut {
  productForm!: FormGroup;
  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private snackBar = inject(SnackBarService);
  private productService = inject(ProductService);
  private loader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [{ value: this.data.name, disabled: true }, Validators.required],
      color: [null, Validators.required],
      dimension: [null, Validators.required],
      thickness: [null, Validators.required],
      specification: [null, Validators.required],
    });
  }

  onClickConfirm(): void {
    if (this.productForm.valid) {
      /* this.dialogRef.close(this.productForm.value); */
      const payload = {
        flag: "Add",
        id: 0,
        parent_Product_id: Number(this.data.id),
        color: this.productForm.value.color,
        dimension: this.productForm.value.dimension,
        thickness: this.productForm.value.thickness,
        specification: this.productForm.value.specification,
        base_price: 10.0,
        selling_price: 123.0,
        isactive: true,
      }
      this.loader.start();
      this.productService.addOrUpdateProductSpecification(payload).subscribe({
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
