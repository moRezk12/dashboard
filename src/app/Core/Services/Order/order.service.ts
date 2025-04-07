import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor( private http: HttpClient ) { }

  // Get Order
  getOrder(page?: number) : Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params.set('page', page);
    }
    return this.http.post(`${environment.apiUrl}/product/getAllOrders`, {} , { params });
  }

  // Updata Order
  updataOrder(id : any , data : any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/product/updateOrder/${id}`, data);
  }

  // Delete Order
  deleteOrder(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/product/cancelOrder/${id}`);
  }

  // Send Message To User
  sendToUser(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category/sendNotificationToUser`, data);
  }

}
