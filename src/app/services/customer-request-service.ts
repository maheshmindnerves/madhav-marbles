import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerRequestService {

    constructor(private http: HttpClient) { }

    // GET
    GetRequestProductList(): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'CustomerRequest/GetRequestProductList');
    }

    GetRequestProductDetail(id: number): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'CustomerRequest/GetRequestProductDetail?prodid=' + id);
    }

    SubmitRequestOrder(payload: any): Observable<any> {
        return this.http.post(environment.baseApiUrl + 'CustomerRequest/SubmitRequestOrder', payload);
    }

    GetRequestOrderCategory(): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'CustomerRequest/GetRequestOrderCategory');
    }

    GetRequestOrderProjectType(): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'CustomerRequest/GetRequestOrderProjectType');
    }

}