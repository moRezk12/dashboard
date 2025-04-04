import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {


   constructor(private http: HttpClient) { }

    // Get Department
    getDepartment(): Observable<any> {
      return this.http.get(`${environment.apiUrl}/category/getdepartment`);
    }


    // Create Department
    createDepartment(data : any): Observable<any> {
      return this.http.post(`${environment.apiUrl}/category/createdepatment`, data);
    }

    // Update Department
    updateDepartment( id : any , data : any): Observable<any> {
      return this.http.patch(`${environment.apiUrl}/category/updateDepartment/${id}`, data);
    }

    // Delete Department
    deleteDepartment(id : any): Observable<any> {
      return this.http.delete(`${environment.apiUrl}/category/deletedepartment/${id}`);
    }

}
