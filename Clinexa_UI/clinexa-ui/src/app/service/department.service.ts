import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private baseUrl = 'http://localhost:8081/departments';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(`${this.baseUrl}`);
  }

  create(data: any) {
    return this.http.post(`${this.baseUrl}`, data);
  }

  getDepartmentCount() {
    return this.http.get(`${this.baseUrl}/count`);
  }

  updateDepartment(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteDepartment(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

}
