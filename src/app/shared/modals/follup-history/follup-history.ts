import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-follup-history',
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './follup-history.html',
  styleUrl: './follup-history.scss',
})
export class FollupHistory {
  searchValue = new FormControl('', Validators.nullValidator);
  filteredData!: HistoryData[];
  data = inject<HistoryData[]>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.filteredData = this.data;
  }

  ngAfterViewInit(): void {
    this.searchValue.valueChanges.subscribe((searchText) => {
      if (searchText === '' || searchText === null) {
        this.filteredData = this.data;
      } else {
        this.filteredData = this.data.filter(item =>
          item.Call_Status.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Follow_Up_Date.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Lead_Status.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Primary_Rejection_Reason.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Sub_Primary_Rejection_Reason.toLowerCase().includes(searchText.toLowerCase()) ||
          item.User_Full_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Next_Meeting_Date.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Remark.toLowerCase().includes(searchText.toLowerCase()) ||
          item.RequestID.toLowerCase().includes(searchText.toLowerCase()) ||
          item.id.toString().includes(searchText)
        );
      }
    });
  }
}


export interface HistoryData {
  Call_Status: string;
  Follow_Up_Date: string;
  Lead_Status: string;
  Next_Meeting_Date: string;
  Primary_Rejection_Reason: string;
  Remark: string;
  RequestID: string;
  Sub_Primary_Rejection_Reason: string;
  User_Full_name: string;
  id: string;
}