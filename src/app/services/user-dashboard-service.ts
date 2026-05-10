import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserDashboardService {

    constructor(private http: HttpClient) { }

    // GET
    GetUserDashboardSummaryData(userId:number): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'UserDashBoard/GetUserDashboardSummaryData?userid='+userId);
    }

  }