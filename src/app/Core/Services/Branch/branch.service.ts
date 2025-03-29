import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BranchService {


    constructor(private http: HttpClient) { }


    // Get Branches
    getBranches(): Observable<any> {
      return this.http.get(`${environment.apiUrl}/product/getAllBranches/admin`);
    }

    // Create Branch
    createBranch(data : any): Observable<any> {
      return this.http.post(`${environment.apiUrl}/product/createBranch/admin`, data);
    }

    // Delete Branch
    deleteBranch(id : any): Observable<any> {
      return this.http.delete(`${environment.apiUrl}/product/deleteBranch/${id}/admin`);
    }

}
