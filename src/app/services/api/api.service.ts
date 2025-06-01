import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ApiService {
  constructor(private http: HttpClient) {
  }


  // GET Request
  getData( endpoint: string): Observable<any> {
    return this.http.get(endpoint);
  }

  // POST Request
  postData(endpoint: string, payload: any): Observable<any> {
    return this.http.post(endpoint, payload);
  }

  // PUT Request
  updateData(endpoint: string, payload: any): Observable<any> {
    return this.http.put(endpoint, payload);
  }

  // DELETE Request
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(endpoint);
  }
}
