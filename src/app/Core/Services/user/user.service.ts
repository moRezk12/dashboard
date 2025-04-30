import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }


    // Get All Users
    getUsers(page?: number): Observable<any> {
      let params = new HttpParams();
      if (page) {
        params = params.set('page', page);
      }
      return this.http.post(`${environment.apiUrl}/user/getAllUsers`, {} );
    }

    // Update user
    updateUser(data : any): Observable<any> {
      return this.http.patch(`${environment.apiUrl}/user/Updateuseraccount`, data);
    }

    // updata Notification
    updateNotification(data : any): Observable<any> {
      return this.http.post(`${environment.apiUrl}/category/updateNotification`, data);
    }

    // Delete User
    deleteUser(id : any): Observable<any> {
      return this.http.delete(`${environment.apiUrl}/product/deleteProduct/${id}`);
    }


    // Send Notificatin For User
    sendNotify(body : any ):Observable<any>{
      return this.http.post<any>(`${environment.apiUrl}/category/sendnotification` ,body);
    }

}
