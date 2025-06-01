import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private data: any = null;

  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  clearData() {
    this.data = null; // Optional: Clear after reading
  }

}
