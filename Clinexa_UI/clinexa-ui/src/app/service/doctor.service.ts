import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private doctorUrl = 'http://localhost:8081/doctors';
  private appointmentUrl = 'http://localhost:8081/appointments';
  private medicalRecordUrl = 'http://localhost:8081/medical-records';

  constructor(private http: HttpClient) {}

  getAllDoctors() {
    return this.http.get<any[]>(this.doctorUrl);
  }

  createDoctor(data: any) {
    return this.http.post(this.doctorUrl, data);
  }

  deleteDoctor(id: number) {
    return this.http.delete(`${this.doctorUrl}/${id}`);
  }

  getDoctorById(id: number) {
    return this.http.get(`${this.doctorUrl}/${id}`);
  }

  updateDoctor(id: number, data: any) {
    return this.http.put(`${this.doctorUrl}/${id}`, data);
  }

  toggleAvailability(id: number) {
    return this.http.put(`${this.doctorUrl}/${id}/toggle-availability`, {});
  }

  getDoctorCount() {
    return this.http.get<number>(`${this.doctorUrl}/count`);
  }

  getActiveDoctorCount() {
    return this.http.get<number>(`${this.doctorUrl}/count/active`);
  }

  getInactiveDoctorCount() {
    return this.http.get<number>(`${this.doctorUrl}/count/inactive`);
  }

  getMyAppointments() {
    return this.http.get<any[]>(`${this.appointmentUrl}/doctor/my`);
  }

  getAppointmentById(id: number) {
    return this.http.get<any>(`${this.appointmentUrl}/${id}`);
  }

  updateAppointmentStatus(id: number, status: string) {
    return this.http.put(
      `${this.appointmentUrl}/${id}/doctor-status?status=${status}`,
      {},
    );
  }

  getMedicalRecord(appointmentId: number) {
    return this.http.get<any>(`${this.medicalRecordUrl}/${appointmentId}`);
  }

  saveMedicalRecord(appointmentId: number, data: any) {
    return this.http.put(`${this.medicalRecordUrl}/${appointmentId}`, data);
  }
}
