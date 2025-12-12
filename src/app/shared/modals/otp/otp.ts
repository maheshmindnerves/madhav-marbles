import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-otp',
  imports: [MatDialogModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class Otp {

  ngOnInit(): void {
    document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
      const el = input as HTMLInputElement;   // ✅ type cast
      el.addEventListener('input', () => {
        if (el.value && index < inputs.length - 1) {
          (inputs[index + 1] as HTMLInputElement).focus();
        }
      });
    });
  }
}
