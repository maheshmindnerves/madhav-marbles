import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { MY_DATE_FORMATS, ResultModel } from '../../models/result.model';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-sales-follow-up',
  imports: [MatDialogModule, ReactiveFormsModule, MatDatepickerModule],
  templateUrl: './sales-follow-up.html',
  styleUrl: './sales-follow-up.scss',
})
export class SalesFollowUp {
  salesFollowForm!: FormGroup;
  minDate = new Date().toISOString().split('T')[0];
  readonly crService = inject(CustomerRequestService);
  private snackBar = inject(SnackBarService);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private loader = inject(NgxUiLoaderService);
  readonly dialogRef = inject(MatDialogRef);
  readonly fb = inject(FormBuilder);
  readonly leadStatus = signal<leadStatus[]>([]);

  ngOnInit(): void {
    this.salesFollowForm = this.fb.group({
      requestId: [this.data.RequestID],
      salesUserId: ['0'],
      requestCallStatus: [null, Validators.required],
      resuestLeadStatusId: [null, Validators.required],
      followupDate: [null, Validators.required],
      nextFollowupDate: [null, Validators.required],
      remark: ['', Validators.required]
    });

    this.getLeadStatus();
  }

  getLeadStatus(): void {
    this.crService.GetLeadStatus().subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          this.leadStatus.set(res.data);
        } else {
          this.snackBar.error('No data found.');
        }
      }, error: (err: any) => {
        console.error('Error:', err);
      },
      complete: () => {
        this.loader.stop();
      }
    });
  }

  onClickConfirm(): void {
    if (this.salesFollowForm.valid) {
      this.loader.start();
      this.crService.RequestSalesFollowUp(this.salesFollowForm.getRawValue()).subscribe({
        next: (res: ResultModel) => {
          if (res.isSuccess && res.data.length > 0) {
            this.snackBar.success(res.data[0].Result);
            this.dialogRef.close(true);
          } else {
            this.snackBar.error('No data found.');
          }
        }, error: (err: any) => {
          console.error('Error:', err);
        },
        complete: () => {
          this.loader.stop();
        }
      });
    } else {
      this.salesFollowForm.markAllAsTouched();
    }

  }

}

export interface leadStatus {
  id: string;
  Lead_Status: string;
}