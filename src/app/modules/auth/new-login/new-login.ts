import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../services/snack-bar-service';
import { AuthService } from '../../../services/auth';
import { ResultModel } from '../../../shared/models/result.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { StorageService } from '../../../services/storage-service';

@Component({
  selector: 'app-new-login',
  templateUrl: './new-login.html',
  styleUrl: './new-login.scss',
  standalone: false,
})
export class NewLogin {
  activeTab: string = 'existing';
  newUser!: FormGroup;
  private loader = inject(NgxUiLoaderService);
  mobileNumber = new FormControl('9950271506', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
  readonly fb = inject(FormBuilder);
  protected readonly isOTP = signal(false);
  protected readonly userData = signal<UserDetails | null>(null);

  private router = inject(Router);
  private snackBar = inject(SnackBarService);
  otpForm!: FormGroup;
  private authService = inject(AuthService);
  private storage = inject(StorageService);

  ngOnInit(): void {
    this.newUser = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      emailId: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

    this.otpForm = this.fb.group({
      v1: ['', Validators.required],
      v2: ['', Validators.required],
      v3: ['', Validators.required],
      v4: ['', Validators.required],
    });
  }

  onClickGetOtp(value: boolean): void {
    if (this.mobileNumber.value?.length === 10) {
      this.loader.start();
      this.authService.ValidateUser('91' + this.mobileNumber.value).subscribe({
        next: (res: ResultModel) => {
          if (res.isSuccess) {
            this.otpForm = this.fb.group({
              v1: ['', Validators.required],
              v2: ['', Validators.required],
              v3: ['', Validators.required],
              v4: ['', Validators.required],
            });
            this.isOTP.set(value);
            this.userData.set(res.data[1]);
          } else {
            this.snackBar.error(res.message);
          }
        }, error: (err) => {
          console.error('Error:', err);
        },
        complete: () => {
          this.loader.stop();
        }
      });
    } else {
      this.snackBar.error('Invalid mobile number!');
    }
  }

  verify(): void {
    const otpValue = this.otpForm.value;
    const otp = Number(otpValue.v1 + otpValue.v2 + otpValue.v3 + otpValue.v4);
    if (otp === 1234) {
      this.authService.login();
      this.storage.setItem('userId', this.userData()?.id);
      this.storage.setItem('userName', this.userData()?.User_Full_name);
      this.storage.setItem('userEmail', this.userData()?.Email);
      this.storage.setItem('userMobile', this.userData()?.MobileNo);
      this.storage.setItem('userCatID', this.userData()?.CatID);
      if (this.userData()?.CatID === '1') {
        this.router.navigate(['/main/user-dashboard']);
      }

      if (this.userData()?.CatID === '3') {
        this.router.navigate(['/main/admin-dashboard']);
      }

      if (this.userData()?.CatID === '4') {
        this.router.navigate(['/main/catlog']);
      }

    } else {
      this.snackBar.error('Invalid OTP!');
    }
    // redirect to home
  }

  onInputChange(event: Event): void {
    const target = (event.target as HTMLInputElement);
    const val = target.value;
    if (val != "") {
      const next: any = target.nextElementSibling;
      if (next) {
        next.focus();
      }
    }
  }


}

export interface UserDetails {
  id: string;
  User_Full_name: string;
  Email: string;
  MobileNo: string;
  CatID: string;
  Contact_Address: string;
  UserName: string;
  User_Category_name: string;
}