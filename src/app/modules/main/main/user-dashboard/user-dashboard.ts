import { Component, inject, signal } from '@angular/core';
import { ResultModel } from '../../../../shared/models/result.model';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackBarService } from '../../../../services/snack-bar-service';
import { UserDashboardService } from '../../../../services/user-dashboard-service';
import { StorageService } from '../../../../services/storage-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HistoryDataComponent } from '../../../../shared/modals/history-data/history-data';
import { ReportsService } from '../../../../services/reports-service';

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, MatIconModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
  readonly udService = inject(UserDashboardService);
  private snackBar = inject(SnackBarService);
  private loader = inject(NgxUiLoaderService);
  readonly dialog = inject(MatDialog);
  private storage = inject(StorageService);
  private router = inject(Router);
  private reportsService = inject(ReportsService);
  protected readonly dashboardSummary = signal<DashboardSummary | null>(null);

  ngOnInit(): void {
    this.getRequestList();
  }

  getRequestList(): void {
    this.loader.start();
    this.udService.GetUserDashboardSummaryData(this.storage.getItem('userId')).subscribe({
      next: (res: any) => {
        this.loader.stop();
        if (res.isSuccess) {
          this.dashboardSummary.set( res.data);
        } else {
          this.snackBar.error(res.message);
        }
      }, error: (err) => {
        this.loader.stop();
        console.error('Error:', err);
      }
    });
  }

  onClickCard(): void {
    this.router.navigate(['/main/sales-request']);
  }

  onClickHistory(reportType: string, flag: string, title: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.loader.start();
    const payload = {
      flag: flag,
      userid: Number(this.storage.getItem('userId') || 0),
      Reporttype: reportType
    };
    this.reportsService.GetReportData(payload).subscribe({
      next: (res: any) => {
        this.loader.stop();
        if (res.isSuccess) {
          if (res.data && res.data.length > 0) {
            this.dialog.open(HistoryDataComponent, {
              data: {
                title: title,
                rows: res.data
              },
              width: '90vw',
              maxWidth: '900px',
              height: 'auto',
              maxHeight: '90vh'
            });
          } else {
            this.snackBar.error('No data found.');
          }
        } else {
          this.snackBar.error(res.message || 'Failed to retrieve report data');
        }
      },
      error: (err) => {
        this.loader.stop();
        console.error('Error fetching report data:', err);
        this.snackBar.error('An error occurred while fetching report data.');
      }
    });
  }
}

export interface DashboardSummary {
  DealsClosed: number;
  FollowupDueToday: number;
  TodayLeads: number;
  TotalGeneratedRevenueLeads: number;
  TotalLeads: number;
  TodayFollowupList: FollowupItem[];
}

export interface FollowupItem {
  RequestID: number;
  Meeting_Time: string;
  CustomerName: string;
  Call_Status: string;
  Lead_Status: string;
  Priority: string;
  Remark: string;
}
