import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule, GridApi, GridReadyEvent, FirstDataRenderedEvent, GridSizeChangedEvent } from 'ag-grid-community';

ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'app-history-data',
  standalone: true,
  imports: [MatDialogModule, AgGridAngular],
  templateUrl: './history-data.html',
  styleUrl: './history-data.scss',
})
export class HistoryDataComponent implements OnInit {
  readonly data = inject<any>(MAT_DIALOG_DATA, { optional: true });
  dialogTitle = 'History Data';
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [];
  rowData: any[] = [];

  // Default Column Properties
  defaultColDef: ColDef = {
    minWidth: 100,
    resizable: true,
    cellStyle: { 'text-align': 'center' }
  };

  // Pagination Configuration
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector = [5, 10, 20];

  ngOnInit(): void {
    if (this.data) {
      if (this.data.rows && Array.isArray(this.data.rows)) {
        this.dialogTitle = this.data.title || 'History Data';
        this.rowData = this.data.rows;
      } else if (Array.isArray(this.data)) {
        this.rowData = this.data;
      }

      if (this.rowData && this.rowData.length > 0) {
        const firstRow = this.rowData[0];
        this.columnDefs = Object.keys(firstRow).map(key => {
          let headerName = key
            .replace(/([A-Z])/g, ' $1') // split camelCase/PascalCase
            .replace(/_/g, ' ') // split snake_case
            .trim();
          headerName = headerName.charAt(0).toUpperCase() + headerName.slice(1);
          
          // Remove the word "Requester" (case-insensitive) and any resulting leading/trailing spaces
          headerName = headerName.replace(/requester/gi, '').trim();
          if (headerName.length > 0) {
            headerName = headerName.charAt(0).toUpperCase() + headerName.slice(1);
          }
          
          return {
            field: key,
            headerName: headerName,
            sortable: false,
            filter: false,
            resizable: true
          };
        });
      }
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  exportToCsv(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: `${this.dialogTitle.replace(/\s+/g, '_')}_history.csv`
      });
    }
  }

  onSearch(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', filterValue);
    }
  }

  onFirstDataRendered(params: FirstDataRenderedEvent): void {
    setTimeout(() => {
      this.adjustColumnWidths(params.api);
    }, 250);
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
    this.adjustColumnWidths(params.api);
  }

  private adjustColumnWidths(api: GridApi): void {
    if (api) {
      const columns = api.getColumns();
      if (columns) {
        const colIds = columns.map(col => col.getColId());
        api.autoSizeColumns(colIds, false);
      }
    }
  }
}
