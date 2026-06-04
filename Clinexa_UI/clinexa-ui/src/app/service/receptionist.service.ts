import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReceptionistService {
  baseUrl = 'http://localhost:8081/receptionists';

  constructor(private http: HttpClient) {}

  createReceptionist(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  getAllReceptionists() {
    return this.http.get(this.baseUrl);
  }

  deleteReceptionist(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateReceptionist(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  getReceptionistById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  toggleStatus(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/toggle-status`, {});
  }
  getReceptionistCount() {
    return this.http.get(`${this.baseUrl}/count`);
  }

  getActiveReceptionistCount() {
    return this.http.get(`${this.baseUrl}/count/active`);
  }

  getInactiveReceptionistCount() {
    return this.http.get(`${this.baseUrl}/count/inactive`);
  }
}
