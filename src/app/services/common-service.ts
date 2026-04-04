import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(private http: HttpClient) { }

    GetPrimaryRejectionReason(): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'common/GetPrimaryRejectionReason');
    }

    GetSubPrimaryRejectionReason(id: number): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'common/GetSubPrimaryRejectionReason/?id=' + id);
    }


}