import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
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
export class NewLogin implements OnInit, OnDestroy {
  activeTab: string = 'existing';
  newUser!: FormGroup;
  private loader = inject(NgxUiLoaderService);
  mobileNumber = new FormControl('9950271506', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
  readonly fb = inject(FormBuilder);
  protected readonly isOTP = signal(false);
  protected readonly userData = signal<UserDetails | null>(null);

  protected readonly timerSeconds = signal(300);
  protected readonly timerText = signal('05:00');
  private timerInterval: any;

  private router = inject(Router);
  private snackBar = inject(SnackBarService);
  otpForm!: FormGroup;
  private authService = inject(AuthService);
  private storage = inject(StorageService);

  ngOnInit(): void {
    this.newUser = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      userAddress: ['', Validators.required],
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
            if (value) {
              this.startTimer();
            } else {
              this.stopTimer();
            }
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
      this.storage.setItem('userAddress', this.userData()?.Contact_Address || '');
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
    const target = event.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, '');
    const val = target.value;

    const controlName = target.getAttribute('formControlName');
    if (controlName) {
      this.otpForm.get(controlName)?.setValue(val, { emitEvent: false });
    }

    if (val !== '') {
      const next = target.nextElementSibling as HTMLInputElement;
      if (next) {
        next.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && target.value === '') {
      const prev = target.previousElementSibling as HTMLInputElement;
      if (prev) {
        prev.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/[^0-9]/g, '').substring(0, 4);

    if (digits.length > 0) {
      const keys = ['v1', 'v2', 'v3', 'v4'];
      const patchObj: { [key: string]: string } = {};
      for (let i = 0; i < Math.min(digits.length, 4); i++) {
        patchObj[keys[i]] = digits[i];
      }
      this.otpForm.patchValue(patchObj);

      const inputs = document.querySelectorAll('.otp-screen .input');
      const focusIndex = Math.min(digits.length, 3);
      if (inputs[focusIndex]) {
        (inputs[focusIndex] as HTMLInputElement).focus();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer(): void {
    this.stopTimer();
    this.timerSeconds.set(300);
    this.timerText.set('05:00');

    this.timerInterval = setInterval(() => {
      const current = this.timerSeconds();
      if (current <= 1) {
        this.stopTimer();
        this.timerSeconds.set(0);
        this.timerText.set('00:00');
      } else {
        const next = current - 1;
        this.timerSeconds.set(next);
        const minutes = Math.floor(next / 60);
        const seconds = next % 60;
        this.timerText.set(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resendOtp(): void {
    this.onClickGetOtp(true);
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