import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { MY_DATE_FORMATS, ResultModel } from '../../models/result.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { CommonService } from '../../../services/common-service';

@Component({
  selector: 'app-sales-follow-up',
  imports: [MatDialogModule, ReactiveFormsModule, MatDatepickerModule, MatTimepickerModule],
  templateUrl: './sales-follow-up.html',
  styleUrl: './sales-follow-up.scss',
})
export class SalesFollowUp {
  salesFollowForm!: FormGroup;
  requesstRejectForm!: FormGroup;
  requestCallStatus = new FormControl('open', Validators.nullValidator);
  minDate = new Date().toISOString().split('T')[0];
  readonly crService = inject(CustomerRequestService);
  private snackBar = inject(SnackBarService);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private loader = inject(NgxUiLoaderService);
  readonly dialogRef = inject(MatDialogRef);
  readonly fb = inject(FormBuilder);
  readonly leadStatus = signal<leadStatus[]>([]);
  primaryReasons = signal<PrimaryReason[]>([]);
  subPrimaryReason = signal<SubPrimaryReason[]>([]);
  readonly commonService = inject(CommonService);

  ngOnInit(): void {
    this.salesFollowForm = this.fb.group({
      requestId: [this.data.RequestID],
      salesUserId: ['0'],
      requestCallStatus: [null, Validators.required],
      resuestLeadStatusId: [null, Validators.required],
      followupDate: [null, Validators.required],
      nextFollowupDate: [null, Validators.required],
      nextFollowupTime: [null, Validators.required],
      remark: ['', Validators.required]
    });

    this.requesstRejectForm = this.fb.group({
      requestCancelRemark: ['', Validators.required],
      primaryRejectionReasonId: [null, Validators.required],
      subPrimaryRejectionReasonId: [{ value: null, disabled: true }, Validators.required],
      requestId: [Number(this.data.RequestID)],
      requestCancelledBy: [0],
    });

    this.getLeadStatus();
  }

  onChangeCallStatus(): void {
    if (this.requestCallStatus.value === 'close') {
      this.commonService.GetPrimaryRejectionReason().subscribe({
        next: (res: ResultModel) => {
          if (res.isSuccess && res.data.length > 0) {
            this.primaryReasons.set(res.data);
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
      const payload = this.salesFollowForm.getRawValue();
      payload['requestCallStatus'] = this.requestCallStatus.value;

      this.crService.RequestSalesFollowUp(payload).subscribe({
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

  onChangeReason(): void {
    this.loader.start();
    this.commonService.GetSubPrimaryRejectionReason(this.requesstRejectForm.value.primaryRejectionReasonId).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          this.subPrimaryReason.set(res.data);
          this.requesstRejectForm.get('subPrimaryRejectionReasonId')?.enable();
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

}

export interface leadStatus {
  id: string;
  Lead_Status: string;
}

export interface PrimaryReason {
  id: string;
  Primary_Rejection_Reason: string;
}

export interface SubPrimaryReason {
  SubPrimaryRejectionId: string;
  Sub_Primary_Rejection_Reason: string;
}