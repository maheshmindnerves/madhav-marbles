import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../services/product-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { ResultModel } from '../../models/result.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';

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
  productList = signal<any[]>([]);
  companyList = signal<any[]>([]);
  subCategoryList = signal<any[]>([]);

  ngOnInit(): void {
    this.productForm = this.fb.group({
      company_Id: [null, Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      category: [null, Validators.required],
      subCategory_Id: [{ value: null, disabled: true }, Validators.required],
    });
    this.getCategory();
  }

  getCategory(): void {
    this.loader.start();
    forkJoin({
      productList: this.productService.GetCategory(),
      companyList: this.productService.GetCompanyList()
    }).subscribe({
      next: (res) => {
        this.productList.set(res.productList.data);
        this.companyList.set(res.companyList.data);
      },
      error: (err) => {
        this.loader.stop();
        console.error('Error:', err);
      },
      complete: () => {
        this.loader.stop();
      }
    });
  }

  onClickConfirm(): void {
    if (this.productForm.valid) {
      const payload = {
        item_Code: this.productForm.value.code,
        name: this.productForm.value.name,
        category_id: this.productForm.value.category,
        isactive: true, //when prodcut edit then flag false
        flag: "Add",
        id: 0,
        category_desc: "",
        company_Id: this.productForm.value.company_Id,
        subCategory_Id: this.productForm.value.subCategory_Id,
        category_name: this.productList().find(res => this.productForm.value.category == res.id).category_Name
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

  onChangeCategory(): void {
    this.loader.start();
    const subCategory = this.productForm.get('subCategory_Id');
    subCategory?.setValue(null);
    this.productService.GetProductSubCategory(this.productForm.value.category).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess) {
          this.subCategoryList.set(res.data);
          subCategory?.enable();
        } else {
          this.snackBar.error(res.message);
          subCategory?.disable();
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
