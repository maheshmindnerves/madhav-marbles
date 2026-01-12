import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../services/snack-bar-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: false,

})
export class Login implements OnInit {
  protected readonly isOTP = signal(false);
  private authService = inject(AuthService);
  readonly fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(SnackBarService);
  mobileNumber = new FormControl('9950271506', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
  termsCondition = new FormControl(false, Validators.required);
  otpForm!: FormGroup;

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      v1: ['', Validators.required],
      v2: ['', Validators.required],
      v3: ['', Validators.required],
      v4: ['', Validators.required],
    });
  }

  onClickGetOtp(value: boolean): void {
    if (this.mobileNumber.value === '9404697710' || this.mobileNumber.value === '9950271506') {
      this.isOTP.set(value);
    } else {
      this.snackBar.error('Invalid mobile number!');
    }
  }

  verify(): void {
    const otpValue = this.otpForm.value;
    const otp = Number(otpValue.v1 + otpValue.v2 + otpValue.v3 + otpValue.v4);
    if (otp === 1234) {
      this.authService.login();
      if (this.mobileNumber.value === '9404697710') {
        this.router.navigate(['/main/product-catalog']);
      }

      if (this.mobileNumber.value === '9950271506') {
        this.router.navigate(['/main/dashboard']);
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
