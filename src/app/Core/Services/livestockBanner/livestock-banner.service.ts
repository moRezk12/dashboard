import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LivestockBannerService {

  constructor(private http: HttpClient) { }

  // Get Adv
  getlivestock(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/product/getAllyalla`);
  }


  // Create Advertisement
  createlivestock(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/product/createyalla`, data);
  }

  // Delete Advertisement
  deletelivestock(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/product/deleteyalla`,{body : id});
  }
}
