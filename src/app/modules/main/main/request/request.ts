import { Component, inject, signal } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { CustomerRequestService } from '../../../../services/customer-request-service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackBarService } from '../../../../services/snack-bar-service';
import { ResultModel } from '../../../../shared/models/result.model';
import { CategoryDetails } from '../../../../shared/modals/category-details/category-details';
import { AssignToSale } from '../../../../shared/modals/assign-to-sale/assign-to-sale';
import { RequestReject } from '../../../../shared/modals/request-reject/request-reject';

@Component({
  selector: 'app-request',
  imports: [MatTabsModule],
  templateUrl: './request.html',
  styleUrl: './request.scss',
})
export class Request {
  protected readonly requestItems = signal<requestItems[]>([]);
  protected readonly rassignedToSalesItems = signal<requestItems[]>([]);
  protected readonly cancelRequestItems = signal<requestItems[]>([]);
  readonly fb = inject(FormBuilder);
  readonly crService = inject(CustomerRequestService);
  private snackBar = inject(SnackBarService);
  private loader = inject(NgxUiLoaderService);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getRequestList();
  }

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.getRequestList();
    }

    if (event.index === 1) {
      this.getRequestListAssignedTosalesTeam();
    }

    if (event.index === 2) {
      this.GetCancelledRequestList();
    }
  }

  getRequestList(): void {
    this.loader.start();
    this.requestItems.set([]);
    this.crService.GetRequestList().subscribe({
      next: (res: ResultModel) => {
        this.loader.stop();
        if (res.isSuccess) {
          if (res.data.length > 0) {
            this.requestItems.set(res.data);
          } else {
            this.snackBar.error('No data found.')
          }
        } else {
          this.snackBar.error(res.message);
        }
      }, error: (err) => {
        this.loader.stop();
        console.error('Error:', err);
      }
    });
  }

  getRequestListAssignedTosalesTeam(): void {
    this.loader.start();
    this.rassignedToSalesItems.set([]);
    this.crService.GetRequestListAssignedTosalesTeam(1).subscribe({
      next: (res: ResultModel) => {
        this.loader.stop();
        if (res.isSuccess) {
          if (res.data.length > 0) {
            this.rassignedToSalesItems.set(res.data);
          } else {
            this.snackBar.error('No data found.')
          }
        } else {
          this.snackBar.error(res.message);
        }
      }, error: (err) => {
        this.loader.stop();
        console.error('Error:', err);
      }
    });
  }

  GetCancelledRequestList(): void {
    this.loader.start();
    this.cancelRequestItems.set([]);
    this.crService.GetCancelledRequestList(1).subscribe({
      next: (res: ResultModel) => {
        this.loader.stop();
        if (res.isSuccess) {
          if (res.data.length > 0) {
            this.cancelRequestItems.set(res.data);
          } else {
            this.snackBar.error('No data found.')
          }
        } else {
          this.snackBar.error(res.message);
        }
      }, error: (err) => {
        this.loader.stop();
        console.error('Error:', err);
      }
    });
  }

  openDialog(item: requestItems, tabName: string): void {
    this.loader.start();
    this.crService.GetRequestIdDetails(item.RequestID).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          res.data.forEach(element => {
            element.hold = element.IsHold === 'True' ? true : false;
            element.sampleOrder = element.Isample === 'True' ? true : false;
          });
          this.dialog.open(CategoryDetails, { data: { title: tabName, data: res.data }, width: '90vw', minWidth: '90vw', height: '90vh' });
        } else {
          this.snackBar.error('No data found.');
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

  onClickAccept(item: requestItems): void {
    this.loader.start();
    this.crService.GetUsers(1).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          const dialogRef = this.dialog.open(AssignToSale, { width: '480px', data: { user: res.data, requestItem: item } });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.getRequestList();
            }
          });
        } else {
          this.snackBar.error('No data found.');
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

  onClickReject(item: requestItems): void {
    const dialogRef = this.dialog.open(RequestReject, { width: '480px', data: item });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRequestList();
      }
    });
  }
}

export interface requestItems {
  RequestID: number;
  Reuest_date: string;
  RequesterName: string;
  Requester_City: string;
  Requester_State: string;
  Requester_Country: string;
  Requester_Email: string;
  Requester_Mobile: string;
  Request_Order_Id: number;
  Request_Order_Project_Type_Id: string;
  Delivery_Address: string;
  Additional_Information: string;
  RequestOrderCategory: string;
  RequestOrder_Project_Type: string;
  User_Full_Name?: string;
  Request_Assigned_Date?: string;
  Is_Request_Cancelled?: string;
  Request_Cancel_Remark?: string;
  Request_Cancelled_User_id?: string;
  Request_Cancelled_Date?: string;
  Primary_Rejection_Reason?: string;
  Sub_Primary_Rejection_Reason?: string;
}