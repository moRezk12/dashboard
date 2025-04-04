import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  constructor(private http: HttpClient) { }


  // Get Social
  getSocial(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/category/getSocialMedia`);
  }

  // Create Social
  createSocial(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category/createSocialMedia`, data);
  }

  // Update Social
  updateSocial(  data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category/updateSocialMedia`, data);
  }

}
