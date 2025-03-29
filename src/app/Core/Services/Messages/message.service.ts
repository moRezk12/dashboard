import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }


  // Get All Message
  getMessage(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/getAllMessages`);
  }

  // Delete Message
  deleteMessage(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/product/deleteProduct/${id}`);
  }
}
