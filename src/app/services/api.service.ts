import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private  baseURL: string = `${environment.serverBaseUrl}:${environment.serverPort}`;
  
  constructor(private http : HttpClient)
  {
    console.log(this.baseURL);
  }

   // GET Request
  getData(endpoint: string): Observable<any>
  {
    return this.http.get(`${this.baseURL}/${endpoint}`);
  }

  // POST Request
  postData(endpoint: string, payload: any): Observable<any>
  {
    return this.http.post(`${this.baseURL}/${endpoint}`, payload);
  }

  // PUT Request
  updateData(endpoint: string, payload: any): Observable<any>
  {
    return this.http.put(`${this.baseURL}/${endpoint}`, payload);
  }

  // DELETE Request
  deleteData(endpoint: string): Observable<any>
  {
    return this.http.delete(`${this.baseURL}/${endpoint}`);
  }
}
