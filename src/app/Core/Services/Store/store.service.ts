import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(private http: HttpClient) { }

  // Get Store
  getStore(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/product/getAllMostawdaas`,  {});
  }

  // Create Store
  createStore(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category/createMostawdaa`, data);
  }

  // Update Store
  updateStore( id : any , data : any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/category/updateMostawdaa/${id}`, data);
  }

  // Delete
  deleteStore(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/category/deleteMostawdaa/${id}`);
  }


  // Details One Store
  // Get Product
  getallproductForoneStore(id : any , page?: number ): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params.set('page', page);
    }
    return this.http.post(`${environment.apiUrl}/product/getProductsByMostawdaa/${id}` , {} , { params });
  }

  updateProductOrder(orderedWoods:  { productId: string , mostawdaaId : string, newIndex: number }): Observable<any> {
    console.log( "Api perirri" + JSON.stringify(orderedWoods));
    console.log( orderedWoods);
    return this.http.post(`${environment.apiUrl}/product/reorderProductInWarehouse`, orderedWoods );
  }

  // Create Product
  createProduct(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/product/createMix`, data);
  }

  // Update Product
  updateProduct( id : any , data : any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/product/updateMixPriceAndQuantity/${id}`, data);
  }

  // Delete Product
  deleteProduct(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/category/deleteMix/${id}`);
  }



}
