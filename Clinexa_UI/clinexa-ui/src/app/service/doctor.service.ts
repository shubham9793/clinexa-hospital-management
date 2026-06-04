import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private baseUrl = 'http://localhost:8081/doctors';

  constructor(private http: HttpClient) {}

  getAllDoctors() {
    return this.http.get(`${this.baseUrl}`);
  }

  createDoctor(data: any) {
    return this.http.post(`${this.baseUrl}`, data);
  }

  deleteDoctor(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getDoctorById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateDoctor(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  toggleAvailability(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/toggle-availability`, {});
  }

  getDoctorCount() {
    return this.http.get(`${this.baseUrl}/count`);
  }

  getActiveDoctorCount() {
    return this.http.get(`${this.baseUrl}/count/active`);
  }

  getInactiveDoctorCount() {
    return this.http.get(`${this.baseUrl}/count/inactive`);
  }
}
