import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private http: HttpClient) { }

  $counter : BehaviorSubject<number> = new BehaviorSubject<number>(0);
  counter = this.$counter.asObservable();

  getCounter(value: number) {
    this.$counter.next(value);
  }

  // Get All Notifications
  getNotif(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/product/getAdminNotifications`);
  }

  // Read All Notifications
  readAllNotifications(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/product/markAllAdminNotificationsAsRead` , {});
  }

  // Send Notificatin For All Users
  sendNotify(body : any ):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/category/notifyall` ,body);
  }

}
