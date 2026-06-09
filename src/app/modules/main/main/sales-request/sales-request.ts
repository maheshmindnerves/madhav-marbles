import { Component, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomerRequestService } from '../../../../services/customer-request-service';
import { SnackBarService } from '../../../../services/snack-bar-service';
import { ResultModel } from '../../../../shared/models/result.model';
import { requestItems } from '../request/request';
import { CategoryDetails } from '../../../../shared/modals/category-details/category-details';
import { Invoice } from '../../../../shared/modals/invoice/invoice';
import { SalesFollowUp } from '../../../../shared/modals/sales-follow-up/sales-follow-up';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../../../services/storage-service';
import { FollupHistory } from '../../../../shared/modals/follup-history/follup-history';

@Component({
  selector: 'app-sales-request',
  imports: [MatTabsModule, MatIconModule],
  templateUrl: './sales-request.html',
  styleUrl: './sales-request.scss',
})
export class SalesRequest {
  protected readonly rassignedToRequestItems = signal<requestItems[]>([]);
  protected readonly rassignedToSalesItems = signal<requestItems[]>([]);
  readonly fb = inject(FormBuilder);
  readonly crService = inject(CustomerRequestService);
  private snackBar = inject(SnackBarService);
  private loader = inject(NgxUiLoaderService);
  private storage = inject(StorageService);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getRequestListAssignedTosalesTeam();
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.getRequestListAssignedTosalesTeam();
    }

    if (event.index === 1) {
      this.getProcessDataListofSalesTeam();
    }
  }

  getRequestListAssignedTosalesTeam(): void {
    this.loader.start();
    this.rassignedToRequestItems.set([]);
    this.crService.GetRequestListAssignedTosalesTeam(1).subscribe({
      next: (res: ResultModel) => {
        this.loader.stop();
        if (res.isSuccess) {
          if (res.data.length > 0) {
            this.rassignedToRequestItems.set(res.data);
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

  getProcessDataListofSalesTeam(): void {
    this.loader.start();
    this.rassignedToSalesItems.set([]);
    this.crService.GetProcessDataListofSalesTeam(1).subscribe({
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
      }, error: (err) => {
        console.error('Error:', err);
      }, complete: () => {
        this.loader.stop();
      }
    });
  }

  onClickMaterilized(item?: requestItems): void {
    this.loader.start();
    this.crService.GetMaxInvoiceNo().subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          const dialogRef = this.dialog.open(Invoice, { width: '400px', data: { invoice: res.data, reqestId: item?.RequestID } });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.getRequestListAssignedTosalesTeam();
            }
          });
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

  /*  onClickCancel(item: requestItems): void {
     Swal.fire({
       title: 'Are you sure?',
       text: 'You will to materilized this request!',
       icon: 'warning',
       width: '350px',
       padding: '0.5em',
       showCancelButton: true,
       confirmButtonText: 'Yes!'
     }).then((result) => {
       if (result.isConfirmed) {
 
         const payload = {
           requestId: item.RequestID,
           userid: this.storage.getItem('userId'),
           isRequestReleased: true,
           requestReleaseddBy: 1,
           isRequestMaterilized: false,
           requestMaterializeddBy: 0,
           requesMaterizedInvoiceNo: '0',
           requestMaterializedRemark: "cancelled"
         }
         this.loader.start();
         this.crService.RequestMaterializeBySaleTeam(payload).subscribe({
           next: (res: ResultModel) => {
             if (res.isSuccess) {
               this.getRequestListAssignedTosalesTeam();
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
     });
   } */

  onClickSalesFollwUp(item: requestItems): void {
    const dialogRef = this.dialog.open(SalesFollowUp, { width: '450px', data: item });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRequestListAssignedTosalesTeam();
      }
    });
  }

  onClickHistory(requestId: number): void {
    this.loader.start();
    this.crService.GetFollowUphistory(this.storage.getItem('userId'), requestId).subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          /*   res.data.forEach(element => {
              element.hold = element.IsHold === 'True' ? true : false;
              element.sampleOrder = element.Isample === 'True' ? true : false;
            });*/
          this.dialog.open(FollupHistory, { data: res.data, width: '90vw', minWidth: '90vw', maxHeight: '90vh' });
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


}
