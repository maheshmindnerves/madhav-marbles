import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../../services/product-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { NumbersOnlyDirective } from '../../directive/numbers-only.directive';
import { Otp } from '../otp/otp';
import { ZoomImage } from '../zoom-image/zoom-image';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ResultModel } from '../../models/result.model';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-hold-catlog',
  imports: [MatButtonModule, MatDialogModule, ReactiveFormsModule, NumbersOnlyDirective, MatTooltipModule, MatIconModule],
  templateUrl: './hold-catlog.html',
  styleUrl: './hold-catlog.scss',
})
export class HoldCatlog {
  infoForm!: FormGroup;
  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef);
  data = inject<any>(MAT_DIALOG_DATA);
  private snackBar = inject(SnackBarService);
  private customerService = inject(CustomerRequestService);
  private loader = inject(NgxUiLoaderService);
  readonly dialog = inject(MatDialog);
  categoryTypeList = signal<any[]>([]);
  projectTypeList = signal<any[]>([]);

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      countryCode: [{ value: '+91', disabled: true }],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      category: [null, Validators.required],
      projectType: [null, Validators.required],
      address: ['', Validators.required],
      message: ['']
    });
    this.getCategory();
  }

  getCategory(): void {
    this.loader.start();
    forkJoin({
      categoryTypeList: this.customerService.GetRequestOrderCategory(),
      projectTypeList: this.customerService.GetRequestOrderProjectType()
    }).subscribe({
      next: (res) => {
        this.categoryTypeList.set(res.categoryTypeList.data);
        this.projectTypeList.set(res.projectTypeList.data);
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

  sendOTP(): void {
    if (this.infoForm.valid) {
      this.dialog.open(Otp, { width: '30vw', data: { infoForm: this.infoForm.getRawValue(), catlogData: this.data } });
      this.dialogRef.close();
    } else {
      this.snackBar.error('Select all required fields');
    }
  }

  onClickImage(imageItem: any): void {
    const dialogRef = this.dialog.open(ZoomImage, {
      width: '98vw', maxWidth: '98vw', height: '98vh',
      data: imageItem.Image_Path
    });
  }
}
