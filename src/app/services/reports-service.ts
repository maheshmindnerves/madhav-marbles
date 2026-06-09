import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  GetReportData(payload: { flag: string; userid: number; Reporttype: string }): Observable<any> {
    return this.http.post(environment.baseApiUrl + 'Reports/GetReportData', payload);
  }
}
