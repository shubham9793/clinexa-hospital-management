import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private api = 'http://localhost:8081/patients';

  constructor(private http: HttpClient) {}

  create(patient: any) {
    return this.http.post(this.api, patient);
  }

  getAll() {
    return this.http.get(this.api);
  }

  getById(id: number) {
    return this.http.get(`${this.api}/${id}`);
  }

  updatePatient(id: number, patient: any) {
    return this.http.put(`${this.api}/${id}`, patient);
  }

  deletePatient(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  toggleStatus(id: number) {
    return this.http.put(`${this.api}/${id}/toggle-status`, {});
  }

  getPatientCount() {
    return this.http.get(`${this.api}/count`);
  }

  getActivePatientCount() {
    return this.http.get(`${this.api}/count/active`);
  }

  getInactivePatientCount() {
    return this.http.get(`${this.api}/count/inactive`);
  }
}
