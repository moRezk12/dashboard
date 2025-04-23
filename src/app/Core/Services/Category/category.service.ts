import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  // Get Categories
  getCategories(): Observable<any> {
    // const params = new HttpParams().set('lang', lang);
    return this.http.post(`${environment.apiUrl}/category/getCategory`,  {});
  }


  // Create Category
  createCategory(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category/createCategory`, data);
  }

  // Update Category
  updateCategory( id : any , data : any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/category/updateCategory/${id}`, data);
  }

  // Delete Category
  deleteCategory(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/category/deleteCategory/${id}`);
  }

}
