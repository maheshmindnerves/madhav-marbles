import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { requestItems } from '../../../modules/main/main/request/request';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { ResultModel } from '../../models/result.model';

@Component({
  selector: 'app-assign-to-sale',
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './assign-to-sale.html',
  styleUrl: './assign-to-sale.scss',
})
export class AssignToSale {
  protected readonly sources = signal<leadSource[]>([])
  assignToSaleForm!: FormGroup;
  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef);
  readonly crService = inject(CustomerRequestService);
  private snackBar = inject(SnackBarService);
  private loader = inject(NgxUiLoaderService);
  readonly data = inject<assignUserDetails>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.assignToSaleForm = this.fb.group({
      member: [null, Validators.required],
      note: ['', Validators.nullValidator],
      priority: [null, Validators.required],
      leadSource: [null, Validators.required]
    });

    this.GetLeadSource();
  }

  GetLeadSource(): void {
    this.loader.start();
    this.sources.set([]);
    this.crService.GetLeadSource().subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          this.sources.set(res.data);
        } else {
          this.snackBar.error('No data found.');
        }
      }, error: (err) => {
        console.error('Error:', err);
      }, complete: () => {
        this.loader.stop();
      }
    });
  }

  onClickConfirm(): void {
    if (this.assignToSaleForm.valid) {
      this.loader.start();
      const payload = {
        requestId: this.data.requestItem.RequestID,
        isRequestAccepted: true,
        requestAcceptedBy: 1,
        isRequestAssigned: true,
        requesAssignUserId: this.assignToSaleForm.value.member,
        requestAssignedRemark: this.assignToSaleForm.value.note,
        requestPriority: this.assignToSaleForm.value.priority,
        requestLeadSourceId: this.assignToSaleForm.value.leadSource
      }

      this.crService.RequestAssignToSalesTeam(payload).subscribe({
        next: (res: ResultModel) => {
          if (res.isSuccess) {
            this.snackBar.success(res.data[0].Result);
            this.dialogRef.close(true);
          } else {
            this.snackBar.error(res.message);
          }
        }, error: (err) => {
          console.error('Error:', err);
        }, complete: () => {
          this.loader.stop();
        }
      });
    } else {
      this.assignToSaleForm.markAllAsTouched();
    }

  }
}

export interface assignUserDetails {
  requestItem: requestItems;
  user: userDetails[];   // 👈 make it array
}


export interface userDetails {
  Contact_Address: string;
  Email: string;
  MobileNo: string;
  UserName: string;
  User_Category_id: string;
  User_Full_name: string;
  User_Location_Id: string;
  id: string;
}


export interface leadSource {
  Lead_source: string;
  id: string;
}
