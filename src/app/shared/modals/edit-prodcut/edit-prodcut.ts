import { Component, Inject, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../../services/product-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { ResultModel } from '../../models/result.model';
import { NumbersOnlyDirective } from '../../directive/numbers-only.directive';

@Component({
  selector: 'app-edit-prodcut',
  imports: [MatButtonModule, MatDialogModule, ReactiveFormsModule, NumbersOnlyDirective],
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
  protected readonly colors = signal<string[]>([]);
  suitabilityList = ['Flooring', 'Wall Cladding', 'Kitchen Counter', 'Bathroom ', 'Outdoor '];
  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [{ value: this.data.name, disabled: true }, Validators.required],
      color: [null, Validators.required],
      pattern: [null, Validators.required],
      /*   dimension: [null, Validators.required], */
      /* thickness: [null, Validators.required], */
      specification: [null, Validators.required],
      length: ['', Validators.required],
      width: ['', Validators.required],
      thickness: ['', Validators.required],
      totalArea: [{ value: '', disabled: true }, Validators.required],
      lengthType: ['mm'],
      widthType: ['mm'],
      origin: ['', Validators.required],
      /*       thicknessType: ['mm'], */
      /*   totalAreaType: ['sq.ft'], */
      finishType: [null, Validators.required],
      priceCategory: [null, Validators.required],
      SurfaceQuality: [null, Validators.required],
      suitability: new FormArray([])
    });

    this.setColorsArray();
  }

  onClickConfirm(): void {
    if (this.productForm.valid) {
      /* this.dialogRef.close(this.productForm.value); */
      const formValue = this.productForm.getRawValue();

      if (formValue.suitability.length === 0) {
        this.snackBar.error('Please select at least one application suitability');
        return;
      }

      const payload = {
        flag: "Add",
        id: 0,
        parent_Product_id: Number(this.data.id),
        color: formValue.color,
        specification: formValue.specification,
        base_price: 10.0,
        selling_price: 123.0,
        isactive: true,
        pattern: formValue.pattern,
        length: formValue.length + formValue.lengthType,
        width: formValue.width + formValue.widthType,
        totalArea: formValue.totalArea + 'sq.ft',
        SurfaceQuality: formValue.SurfaceQuality,
        finishType: formValue.finishType,
        priceCategory: formValue.priceCategory,
        application: formValue.suitability.join(','),
        origin: formValue.origin
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

  setColorsArray(): void {
    this.colors.set([
      'White', 'Black', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Cyan', 'Magenta', 'Lime',
      'Teal', 'Indigo', 'Violet', 'Gold', 'Silver', 'Coral', 'Salmon', 'Tomato', 'SkyBlue', 'RoyalBlue', 'SlateGray', 'LightGray', 'DarkGray', 'LightBlue', 'LightGreen', 'LightPink'
    ])
  }

  onChange(event: any) {
    const formArray = this.productForm.get('suitability') as FormArray;

    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.target.value);
      formArray.removeAt(index);
    }

    console.log(formArray.value);
  }

  onFocusOut(event: any): void {
    const fValue = this.productForm.getRawValue();
    let length = Number(fValue.length);
    let width = Number(fValue.width);
    if (length && width) {
      if (fValue.lengthType === 'mm') {
        length = length * 0.00328084;
      }

      if (fValue.widthType === 'mm') {
        width = width * 0.00328084;
      }

      this.productForm.get('totalArea')?.setValue((length * width).toFixed(2));
    }
  }
}
