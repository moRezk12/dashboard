import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor( private http: HttpClient ) { }

  // Get Order
  getOrder() : Observable<any> {
    return this.http.get(`${environment.apiUrl}/product/getAllOrders`);
  }

  // Delete Order
  deleteOrder(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/product/cancelOrder/${id}`);
  }

  // Send Message To User
  sendToUser(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/product/sendNotificationToUser/admin`, data);
  }

}
