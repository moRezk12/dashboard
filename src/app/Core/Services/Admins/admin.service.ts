import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private http: HttpClient) { }

  // Get Categories
  getAdmins(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/product/getAllAdmins/admin`);
  }

  // Create Admins
  createAdmin(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/product/createAdminByOwner/admin`, data);
  }

  // Update Admins
  updateAdmin( id : any , data : any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/product/updateAdminByOwner/${id}/admin`, data);
  }


  // Delete Admins
  deleteAdmin(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/product/deleteAdminByOwner/${id}/admin`);
  }

}
