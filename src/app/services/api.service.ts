import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
baseUrl = 'http://localhost:5000/api';

  constructor(private http:HttpClient) { }
  getProducts(){
   return this.http.get(`${this.baseUrl}/products`);
  }
}
