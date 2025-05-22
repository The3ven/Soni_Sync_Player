import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiServer = environment.apiServerBaseUrl;
  private videoServer = environment.videoServerBaseUrl;

  constructor(private http: HttpClient) {}

  // Fetch all users
  getUsers(): Observable<any> {
    const endpoint = `${this.apiServer}/getUserlist`;
    return this.http.get(endpoint);
  }

  // Add a new user
  addUser(user: any): Observable<any> {
    const endpoint = `${this.apiServer}/addUser`;
    return this.http.post(endpoint, user);
  }

  // Update an existing user
  updateUser(user: any): Observable<any> {
    const endpoint = `${this.apiServer}/updateUser`;
    return this.http.post(endpoint, user);
  }

  // Remove a user
  removeUser(user: any): Observable<any> {
    const endpoint = `${this.apiServer}/removeUser`;
    return this.http.post(endpoint, user);
  }

  // Upload a profile picture
  uploadProfilePicture(file: File, userId: string, email: string, userName: string): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('userId', userId);
    formData.append('email', email);
    formData.append('userName', userName);

    const endpoint = `${this.videoServer}/uploadProfilePicture`;
    return this.http.post(endpoint, formData);
  }
}