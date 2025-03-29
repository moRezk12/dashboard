import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {

    constructor(private http: HttpClient) { }

    // Get Adv
    getAdv(): Observable<any> {
      return this.http.get(`${environment.apiUrl}/product/getAllImages`);
    }


    // Create Advertisement
    createAdv(data : any): Observable<any> {
      return this.http.post(`${environment.apiUrl}/product/createImages/admin`, data);
    }

    // Update Advertisement
    // updateAdv( id : any , data : any): Observable<any> {
    //   return this.http.patch(`${environment.apiUrl}/category/updateCategory/${id}`, data);
    // }

    // Delete Advertisement
    deleteAdv(id : any): Observable<any> {
      return this.http.delete(`${environment.apiUrl}/product/deleteImage/admin`,{body : id});
    }


}
