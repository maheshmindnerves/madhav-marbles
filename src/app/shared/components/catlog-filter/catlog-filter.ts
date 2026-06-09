import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../../services/common-service';
import { CustomerRequestService } from '../../../services/customer-request-service';
import { SnackBarService } from '../../../services/snack-bar-service';
import { FilterResponse } from '../../models/filter.model';
import { ResultModel } from '../../models/result.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catlog-filter',
  imports: [MatCheckboxModule, CommonModule, FormsModule],
  templateUrl: './catlog-filter.html',
  styleUrl: './catlog-filter.scss',
})
export class CatlogFilter {
  protected readonly filterResponse = signal<FilterResponse | null>(null);

  readonly fb = inject(FormBuilder);
  readonly cService = inject(CommonService);
  private snackBar = inject(SnackBarService);
  private loader = inject(NgxUiLoaderService);
  @Output() filterEvent = new EventEmitter<any>();

  ngOnInit(): void {
    this.cService.GetFilterMasterData().subscribe({
      next: (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          this.filterResponse.set(res.data[0]);
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

  onClickType(item: { checked: boolean; }) {
    item.checked = item.checked ? false : true;
    this.filterEvent.emit(this.filterResponse());
  }

  onChangeValue(): void {
    this.filterEvent.emit(this.filterResponse());
  }



  /*  applyFilter(): void {
     this.filterEvent.emit(this.filterResponse());
   }*/

  clearFilter(): void {
    const data = structuredClone(this.filterResponse());
    if (data) {

      data.categories?.forEach((item: any) => {
        item.checked = false;
      });

      data.subcategories?.forEach((item: any) => {
        item.checked = false;
      });

      data.colors?.forEach((item: any) => {
        item.checked = false;
      });

      data.FinishType?.forEach((item: any) => {
        item.checked = false;
      });

      data.Origin?.forEach((item: any) => {
        item.checked = false;
      });

      data.Patterns?.forEach((item: any) => {
        item.checked = false;
      });

      data.Applications?.forEach((item: any) => {
        item.checked = false;
      });
      this.filterResponse.set(data);
    }
  }
}
