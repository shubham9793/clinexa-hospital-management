import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReceptionistService {
  private readonly receptionistUrl = 'http://localhost:8081/receptionists';
  private readonly appointmentUrl = 'http://localhost:8081/appointments';
  private readonly medicalRecordUrl = 'http://localhost:8081/medical-records';

  constructor(private http: HttpClient) {}

  createReceptionist(data: any) {
    return this.http.post(this.receptionistUrl, data);
  }

  getAllReceptionists() {
    return this.http.get(this.receptionistUrl);
  }

  deleteReceptionist(id: number) {
    return this.http.delete(`${this.receptionistUrl}/${id}`);
  }

  updateReceptionist(id: number, data: any) {
    return this.http.put(`${this.receptionistUrl}/${id}`, data);
  }

  getReceptionistById(id: number) {
    return this.http.get(`${this.receptionistUrl}/${id}`);
  }

  toggleStatus(id: number) {
    return this.http.put(`${this.receptionistUrl}/${id}/toggle-status`, {});
  }

  getReceptionistCount() {
    return this.http.get(`${this.receptionistUrl}/count`);
  }

  getActiveReceptionistCount() {
    return this.http.get(`${this.receptionistUrl}/count/active`);
  }

  getInactiveReceptionistCount() {
    return this.http.get(`${this.receptionistUrl}/count/inactive`);
  }

  getAllAppointments() {
    return this.http.get<any[]>(`${this.appointmentUrl}/receptionist/all`);
  }

  cancelAppointment(appointmentId: number) {
    return this.http.put(`${this.appointmentUrl}/${appointmentId}/cancel`, {});
  }

  getMedicalRecord(appointmentId: number) {
    return this.http.get<any>(`${this.medicalRecordUrl}/${appointmentId}`);
  }

  rescheduleAppointment(
    appointmentId: number,
    request: {
      doctorId: number;
      appointmentDate: string;
      slotTime: string;
    },
  ) {
    return this.http.put(
      `${this.appointmentUrl}/${appointmentId}/reschedule`,
      request,
    );
  }
}
