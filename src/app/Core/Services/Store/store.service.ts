import { HttpClient } from '@angular/common/http';
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


  getallproductForoneStore(id : any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/product/getProductsByMostawdaa/${id}`);
  }

}
