import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Patient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  dob?: string;
  address?: string;
  active?: boolean;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface DoctorCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  department?: Department;
  category?: DoctorCategory;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface AppointmentRequest {
  doctorId: number;
  patientName?: string;
  age?: number;
  gender?: string;
  phone?: string;
  description: string;
  appointmentDate: string;
  slotTime: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  age?: number;
  gender?: string;
  phone?: string;
  description: string;
  appointmentDate: string;
  slotTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  doctor: Doctor;
}

export interface MedicalRecord {
  id?: number;
  diagnosis?: string;
  doctorNotes?: string;
  prescription?: string;
  followUpDate?: string;
  createdDate?: string;
  updatedDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly baseUrl = 'http://localhost:8081';

  private readonly patientApi = `${this.baseUrl}/patients`;
  private readonly doctorApi = `${this.baseUrl}/doctors`;
  private readonly departmentApi = `${this.baseUrl}/departments`;
  private readonly categoryApi = `${this.baseUrl}/doctor-categories`;
  private readonly profileApi = `${this.baseUrl}/user/profile`;
  private readonly appointmentApi = `${this.baseUrl}/appointments`;
  private readonly medicalRecordApi = `${this.baseUrl}/medical-records`;

  constructor(private http: HttpClient) {}

  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.patientApi, patient);
  }

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.patientApi);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.patientApi}/${id}`);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.patientApi}/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.patientApi}/${id}`);
  }

  toggleStatus(id: number): Observable<Patient> {
    return this.http.put<Patient>(`${this.patientApi}/${id}/toggle-status`, {});
  }

  getPatientCount(): Observable<number> {
    return this.http.get<number>(`${this.patientApi}/count`);
  }

  getActivePatientCount(): Observable<number> {
    return this.http.get<number>(`${this.patientApi}/count/active`);
  }

  getInactivePatientCount(): Observable<number> {
    return this.http.get<number>(`${this.patientApi}/count/inactive`);
  }

  getLoggedInProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.profileApi);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.doctorApi);
  }

  getAvailableDoctors(): Observable<Doctor[]> {
    return this.getDoctors().pipe(
      map((doctors) => doctors.filter((doctor) => doctor.active)),
    );
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.doctorApi}/${id}`);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.departmentApi);
  }

  getCategories(): Observable<DoctorCategory[]> {
    return this.http.get<DoctorCategory[]>(`${this.categoryApi}/all`);
  }

  bookMyAppointment(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.appointmentApi}/my`, request);
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.appointmentApi}/my`);
  }

  cancelMyAppointment(appointmentId: number): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.appointmentApi}/my/${appointmentId}/cancel`,
      {},
    );
  }

  rescheduleMyAppointment(
    appointmentId: number,
    request: {
      doctorId: number;
      appointmentDate: string;
      slotTime: string;
    },
  ): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.appointmentApi}/my/${appointmentId}/reschedule`,
      request,
    );
  }

  getMedicalRecord(appointmentId: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(
      `${this.medicalRecordApi}/${appointmentId}`,
    );
  }

  getMyMedicalHistory(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.medicalRecordApi}/my`);
  }
}
