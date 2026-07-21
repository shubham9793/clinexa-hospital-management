// import { HttpClient } from '@angular/common/http';

// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class CategoryService {
//   private baseUrl = 'http://localhost:8081/doctor-categories';

//   constructor(private http: HttpClient) {}

//   getAll() {
//     return this.http.get(`${this.baseUrl}/all`);
//   }

//   getCategoryCount() {
//     return this.http.get(`${this.baseUrl}/count`);
//   }
// }


import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/doctor-categories`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getCategoryCount() {
    return this.http.get(`${this.baseUrl}/count`);
  }
}
