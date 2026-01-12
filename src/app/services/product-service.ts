import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) { }

    // GET
    getProducts(): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'Product/Getproducts');
    }

    addOrUpdateProduct(payload: any): Observable<any> {
        return this.http.post(environment.baseApiUrl + 'Product/AddOrUpdateProduct', payload);
    }

    addOrUpdateProductSpecification(payload: any): Observable<any> {
        return this.http.post(environment.baseApiUrl + 'Product/AddOrUpdateProductSpecification', payload);
    }

    GetCategory(): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'Product/GetCategory');
    }

    GetCompanyList(): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'Product/GetCompanyList');
    }

    GetProductSubCategory(id: number): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'Product/GetProductSubCategory?categoryid=' + id);
    }

    GetProductSpecification(id: number): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'Product/GetProductSpecification?pid=' + id);
    }

    AddorUpdateProductGalley(formData: any): Observable<any> {
        return this.http.post(environment.baseApiUrl + 'Product/AddorUpdateProductGalley', formData);
    }

    GetProductGallery(payload: any): Observable<any> {
        return this.http.post(environment.baseApiUrl + 'Product/GetProductGallery', payload);
    }

    DeleteImageFromGallery(id: number): Observable<any> {
        return this.http.get(environment.baseApiUrl + 'Product/DeleteImageFromGallery?imageid=' + id);
    }



    // POST
    /*  createUser(data: any): Observable<any> {
         return this.http.post(this.baseUrl, data);
     }
 
     // PUT
     updateUser(id: number, data: any): Observable<any> {
         return this.http.put(`${this.baseUrl}/${id}`, data);
     }
 
     // DELETE
     deleteUser(id: number): Observable<any> {
         return this.http.delete(`${this.baseUrl}/${id}`);
     } */
}