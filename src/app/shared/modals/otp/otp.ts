import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { ResultModel } from '../../models/result.model';

@Component({
  selector: 'app-otp',
  imports: [MatDialogModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class Otp {
  private snackBar = inject(SnackBarService);
  private customerService = inject(CustomerRequestService);
  private loader = inject(NgxUiLoaderService);
  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef);
  data = inject<any>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log('1111111111111111111111111', this.data);
    document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
      const el = input as HTMLInputElement;   // ✅ type cast
      el.addEventListener('input', () => {
        if (el.value && index < inputs.length - 1) {
          (inputs[index + 1] as HTMLInputElement).focus();
        }
      });
    });
  }

  onClickResend(): void {

  }


  onClickVerify(): void {
    console.log('1111111111111111111', this.createPayload());
    this.loader.start();
    this.customerService.SubmitRequestOrder(this.createPayload()).subscribe({
      next: (res: ResultModel) => {
        this.loader.stop();
        if (res.isSuccess) {
          console.log('44444444444444444444', res.data[0])
          this.snackBar.success(res.data[0].Result);
          this.dialogRef.close(this.createPayload());
        } else {
          this.snackBar.error(res.message);
        }
      }, error: (err) => {
        this.loader.stop();
        console.error('Error:', err);
      }
    });
  }

  createPayload(): any {
    const value = this.data.infoForm;
    return {
      requesterName: value.fullName,
      requester_City: value.city,
      requester_State: value.state,
      requester_Country: value.country,
      requester_Email: value.email,
      requester_Mobile: value.phone,
      request_Order_Id: value.category,
      request_Order_Project_Type_Id: value.projectType,
      delivery_Address: value.address,
      additional_Information: value.message,
      orderDetails: this.getOrderDetails()
    }
  }

  getOrderDetails(): any {
    const orderDetails: any[] = [];
    this.data.catlogData.forEach((element: any) => {
      const obj = {
        requestID: 0,
        parent_Product_Id: element.Parent_Product_id,
        product_Specification_id: element.Product_Specification_id,
        product_Image_Gallery_id: 1,
        request_Location_Id: 1,
        requestQty: 1,
        isample: element.sampleOrder,
        isHold: element.hold
      }
      orderDetails.push(obj);
    });
    return orderDetails;
  }
}
