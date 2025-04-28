import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WoodService {

  constructor(private http: HttpClient) { }


  // Get Woods
  getWoods(page?: number): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params.set('page', page);
    }
    return this.http.post(`${environment.apiUrl}/product/gethatap`, {} , { params });
  }

  updateProductOrder(orderedWoods: { productId: string, newIndex: number }): Observable<any> {
    console.log( "Api" + JSON.stringify(orderedWoods));
    return this.http.post(`${environment.apiUrl}/product/reorderHatap`, orderedWoods );
  }

  // Create Woods
  createWoods(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/product/createHatap`, data);
  }

  // Update Woods
  updateWoods( id : any , data : any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/product/updateHatap/${id}`, data);
  }

  // Delete Woods
  deleteWoods(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/product/deleteHatap/${id}`);
  }

}
