import { Component, computed, inject, signal } from '@angular/core';
import { CategoryDetails } from '../../../../shared/modals/category-details/category-details';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Otp } from '../../../../shared/modals/otp/otp';
import { Filter } from "../../../../shared/components/filter/filter";

@Component({
  selector: 'app-catalog',
  imports: [FormsModule, ReactiveFormsModule, Filter],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class Catalog {
  readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  readonly isSubmit = signal(false);
  readonly isOpenFilter = signal(false);
  readonly holdItem = signal<any[]>([]);
  otpForm!: FormGroup;

  /*   protected readonly items = signal([
      { id: 1, name: 'Item A', img: 'https://lh3.googleusercontent.com/p/AF1QipMAZT2NAuaQom7jG418ggOfJ4-8PU3yK7THVgPL=s680-w680-h510-rw', hold: false, sampleOrder: false, address: 'India' },
      { id: 2, name: 'Item B', img: 'https://lh3.googleusercontent.com/p/AF1QipOxsT3hfJMzE3byqNErrlwMgQgTRtQdgRfTNL2C=s680-w680-h510-rw', hold: false, sampleOrder: false, address: 'India' },
      { id: 3, name: 'Item C', img: 'https://lh3.googleusercontent.com/p/AF1QipPHmhwZxL2JpcDcaGtoCBNX1N9oJ3lpBiWOT2NO=s680-w680-h510-rw', hold: false, sampleOrder: false, address: 'India' },
      { id: 4, name: 'Item D', img: 'https://lh3.googleusercontent.com/p/AF1QipNVZwjUHhqTOLKV3_wq3yKGDv7l_IpdGWyybm_A=s680-w680-h510-rw', hold: false, sampleOrder: false, address: 'India' }
    ]); */
  protected readonly items = signal([
    { id: 1, name: 'Item A', img: 'https://picsum.photos/200/300', hold: false, sampleOrder: false, address: 'India' },
    { id: 2, name: 'Item B', img: 'https://picsum.photos/200/300', hold: false, sampleOrder: false, address: 'India' },
    { id: 3, name: 'Item C', img: 'https://picsum.photos/200/300', hold: false, sampleOrder: false, address: 'India' },
    { id: 4, name: 'Item D', img: 'https://picsum.photos/200/300', hold: false, sampleOrder: false, address: 'India' }
  ]);

  openDialog() {
    this.dialog.open(CategoryDetails);
  }

  submitRequest(): void {
    this.holdItem.set(this.items().filter(item => item.hold));
    if (this.holdItem().length > 0) {
      this.isSubmit.set(true);
      this.otpForm = this.fb.group({
        name: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
      });
    }
  }

  goToCatalog(): void {
    this.isSubmit.set(false);
  }

  onSubmit() {
    this.dialog.open(Otp, { width: '30vw' });
    if (this.otpForm.valid) {
      console.log(this.otpForm.value);

    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  closeNav() {
    this.isOpenFilter.set(false);
    (document.getElementById("mySidebar") as HTMLElement).style.width = "0";
    (document.getElementById("main") as HTMLElement).style.marginLeft = "-11px";
  }

}
