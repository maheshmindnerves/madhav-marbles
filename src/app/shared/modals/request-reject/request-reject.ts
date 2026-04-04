import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ResultModel } from '../../models/result.model';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common-service';

@Component({
  selector: 'app-request-reject',
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './request-reject.html',
  styleUrl: './request-reject.scss',
})
export class RequestReject {
  requesstRejectForm!: FormGroup;
  readonly crService = inject(CustomerRequestService);
  readonly commonService = inject(CommonService);
  private snackBar = inject(SnackBarService);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private loader = inject(NgxUiLoaderService);
  readonly dialogRef = inject(MatDialogRef);
  primaryReasons = signal<PrimaryReason[]>([]);
  subPrimaryReason = signal<SubPrimaryReason[]>([]);
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.requesstRejectForm = this.formBuilder.group({
      requestCancelRemark: ['', Validators.required],
      primaryRejectionReasonId: [null, Validators.required],
      subPrimaryRejectionReasonId: [{ value: null, disabled: true }, Validators.required],
      requestId: [Number(this.data.RequestID)],
      requestCancelledBy: [0],
    });

    this.loader.start();
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

  onClickConfirm(): void {
    if (this.requesstRejectForm.valid) {
      this.loader.start();
      this.crService.RequestCancellByBackOffice(this.requesstRejectForm.getRawValue()).subscribe({
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
      this.requesstRejectForm.markAllAsTouched();
    }
  }

  onChangeReason(): void {
    this.loader.start();
    this.commonService.GetSubPrimaryRejectionReason(this.requesstRejectForm.value.primaryRejectionReasonId).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          this.subPrimaryReason.set(res.data);
          this.requesstRejectForm.get('subPrimaryRejectionReasonId')?.enable();
          console.log('3333333333')
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

export interface PrimaryReason {
  id: string;
  Primary_Rejection_Reason: string;
}

export interface SubPrimaryReason {
  SubPrimaryRejectionId: string;
  Sub_Primary_Rejection_Reason: string;
}