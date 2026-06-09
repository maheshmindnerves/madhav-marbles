import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackBarService } from '../../../../services/snack-bar-service';
import { UserDashboardService } from '../../../../services/user-dashboard-service';
import { ReportsService } from '../../../../services/reports-service';
import { HistoryDataComponent } from '../../../../shared/modals/history-data/history-data';
import { forkJoin } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexAnnotations,
  ApexStates,
  ApexTheme,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, MatIconModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})

export class AdminDashboard {
  readonly udService = inject(UserDashboardService);
  private loader = inject(NgxUiLoaderService);
  readonly dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);
  private reportsService = inject(ReportsService);
  protected readonly adminDashboardData = signal<AdminDashboard | null>(null);
  protected readonly activityData = signal<ActivityData[]>([]);
  protected readonly isLoading = signal(true);

  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      width: 380,
      type: 'donut',
    },
    labels: ['New', 'In Progress', 'Converted', 'Lost'],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: (val: any, opts: any) => {
        return val + "  -  " + opts.w.globals.series[opts.seriesIndex]
      },
    },

    responsive: [{
      breakpoint: 800,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };



  ngOnInit(): void {
    this.getRequestList();
  }

  getRequestList(): void {
    this.loader.start();
    forkJoin({
      dashboard: this.udService.GetAdminDashboardData(),
      activity: this.udService.GetRecentActivityDataforAdmin("All"),
    }).subscribe({
      next: (response) => {
        if (response.dashboard.isSuccess) {
          this.adminDashboardData.set(response.dashboard.data);
          this.chartOptions.series?.push(response.dashboard.data.TotalNewLeads);
          this.chartOptions.series?.push(response.dashboard.data.TotalInProgress);
          this.chartOptions.series?.push(response.dashboard.data.TotalConverted);
          this.chartOptions.series?.push(response.dashboard.data.TotalLost);

        }
        if (response.activity.isSuccess) {
          this.activityData.set(response.activity.data);
        }
      },

      error: (err) => {
        console.error('Error:', err);
      },

      complete: () => {
        setTimeout(() => { this.isLoading.set(false) }, 700);
        this.loader.stop();
      }
    });
  }

  onClickHistory(reportType: string, flag: string, title: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.loader.start();
    const payload = {
      flag: flag,
      userid: 0,
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

export interface AdminDashboard {
  TotalConverted: number;
  TotalCustomers: number;
  TotalInProgress: number;
  TotalLeads: number;
  TotalPendingFollowUps: number;
  TotalLost: number;
  TotalMaterializedDeals: number;
}

export interface ActivityData {
  CustomerName: string;
  SalesPerson: string;
  LeadSource: string;
  LeadStatus: string;
  CallSatus: string;
  NextFollowupDate: string;
  Remark: string;
}

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  subtitle?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  grid?: ApexGrid;
  annotations?: ApexAnnotations;
  states?: ApexStates;
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};
