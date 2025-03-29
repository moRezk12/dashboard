import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }


  // Get Categories
  getProducts(page?: number): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params.set('page', page);
    }
    return this.http.post(`${environment.apiUrl}/product/getProducts`, {} , { params });
  }

  // Create Products
  createProducts(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/product/createProduct`, data);
  }

  // Update Products
  updateProducts( id : any , data : any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/product/updateProduct/${id}`, data);
  }

  // Delete Products
  deleteProducts(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/product/deleteProduct/${id}`);
  }



}
