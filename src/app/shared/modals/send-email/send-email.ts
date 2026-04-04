import { Component, inject } from '@angular/core';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackBarService } from '../../../services/snack-bar-service';
import { ResultModel } from '../../models/result.model';

@Component({
  selector: 'app-send-email',
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './send-email.html',
  styleUrl: './send-email.scss',
})
export class SendEmail {
  email = new FormControl('');
  readonly crService = inject(CustomerRequestService);
  private snackBar = inject(SnackBarService);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private loader = inject(NgxUiLoaderService);
  readonly dialogRef = inject(MatDialogRef);


  onClickConfirm(): void {
  /*   const payload = {
      requestId: Number(this.data.RequestID),
      requestCancelledBy: 0,
      requestCancelRemark: this.reason.value
    }
    this.loader.start();
    this.crService.RequestCancellByBackOffice(payload).subscribe({
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
    }); */
  }
}
