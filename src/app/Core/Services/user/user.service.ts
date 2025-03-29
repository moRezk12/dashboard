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
      return this.http.post(`${environment.apiUrl}/user/getAllUsers`, {} , { params });
    }

    // Delete User
    deleteUser(id : any): Observable<any> {
      return this.http.delete(`${environment.apiUrl}/product/deleteProduct/${id}`);
    }


}
