import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { ResultModel } from '../../models/result.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackBarService } from '../../../services/snack-bar-service';

@Component({
  selector: 'app-invoice',
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './invoice.html',
  styleUrl: './invoice.scss',
})
export class Invoice {
  readonly crService = inject(CustomerRequestService);
  private loader = inject(NgxUiLoaderService);
  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef);
  data = inject<invoiceData>(MAT_DIALOG_DATA);
  date = new Date().toLocaleDateString('en-IN').replace(/\//g, '-');
  remark = new FormControl('', Validators.required);
  private snackBar = inject(SnackBarService);

  onClickSubmit(): void {
    const payload = {
      requestId: this.data.reqestId,
      userid: 1,
      isRequestReleased: false,
      requestReleaseddBy: 1,
      isRequestMaterilized: true,
      requestMaterializeddBy: 0,
      requesMaterizedInvoiceNo: '0',
      requestMaterializedRemark: this.remark.value
    }

    this.loader.start();
    this.crService.RequestMaterializeBySaleTeam(payload).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess) {
          this.dialogRef.close(true);
          this.snackBar.success(res.data[0].Result)
        } else {
          this.snackBar.error(res.message);
        }
      }, error: (err) => {
        console.error('Error:', err);
      }, complete: () => {
        this.loader.stop();
      }
    });
  }
}


export interface invoiceData {
  invoice: string;
  reqestId: string;
}


