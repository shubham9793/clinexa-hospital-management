import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';
import { DoctorService } from 'src/app/service/doctor.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent implements OnInit {
  appointments: any[] = [];

  isLoading = false;
  isUpdating = false;
  isSavingNotes = false;

  searchText = '';
  selectedStatus = '';

  showProfilePopup = false;
  loggedInUser: any = null;
  isProfileLoading = false;

  selectedAppointment: any = null;
  showAppointmentModal = false;

  isMedicalRecordLoading = false;

  private baseUrl = 'http://localhost:8081/appointments';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private doctorService: DoctorService,
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;

    this.doctorService.getMyAppointments().subscribe({
      next: (res: any[]) => {
        console.log('UI RECEIVED:', res.length, res);

        this.appointments = Array.isArray(res) ? res : [];
        this.isLoading = false;
      },

      error: (err) => {
        console.error('Failed to load appointments', err);

        this.appointments = [];
        this.isLoading = false;
      },
    });
  }
  updateStatus(id: number, status: string): void {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Appointment',
        text: 'Appointment information is missing.',
        confirmButtonColor: '#0f766e',
      });
      return;
    }

    const title =
      status === 'CONFIRMED'
        ? 'Confirm Appointment?'
        : status === 'CANCELLED'
          ? 'Cancel Appointment?'
          : 'Mark as Completed?';

    const confirmText =
      status === 'CONFIRMED'
        ? 'Yes, Confirm'
        : status === 'CANCELLED'
          ? 'Yes, Cancel'
          : 'Yes, Complete';

    Swal.fire({
      icon: status === 'CANCELLED' ? 'warning' : 'question',
      title,
      text: `Appointment will be marked as ${status.toLowerCase()}.`,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'No',
      confirmButtonColor: status === 'CANCELLED' ? '#dc2626' : '#0f766e',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.isUpdating = true;

      this.http
        .put(`${this.baseUrl}/${id}/doctor-status?status=${status}`, {})
        .subscribe({
          next: () => {
            this.isUpdating = false;

            Swal.fire({
              icon: 'success',
              title: 'Appointment Updated',
              text: `Appointment marked as ${status.toLowerCase()}.`,
              timer: 1500,
              showConfirmButton: false,
            });

            this.closeAppointmentDetails();
            this.loadAppointments();
          },
          error: (err) => {
            this.isUpdating = false;

            Swal.fire({
              icon: 'error',
              title: 'Status Update Failed',
              text:
                err?.error?.message ||
                err?.error ||
                'Unable to update appointment status.',
              confirmButtonColor: '#dc2626',
            });
          },
        });
    });
  }

  saveDoctorNotes(): void {
    if (!this.selectedAppointment?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Appointment',
        text: 'Appointment information is missing.',
        confirmButtonColor: '#0f766e',
      });
      return;
    }

    const payload = {
      diagnosis: this.selectedAppointment.diagnosis || '',
      prescription: this.selectedAppointment.prescription || '',
      doctorNotes: this.selectedAppointment.doctorNotes || '',
      followUpDate: this.selectedAppointment.followUpDate || null,
    };

    this.isSavingNotes = true;

    this.doctorService
      .saveMedicalRecord(this.selectedAppointment.id, payload)
      .subscribe({
        next: () => {
          this.isSavingNotes = false;

          Swal.fire({
            icon: 'success',
            title: 'Medical Record Saved',
            text: 'Diagnosis, prescription and notes saved successfully.',
            timer: 1500,
            showConfirmButton: false,
          });

          this.closeAppointmentDetails();
          this.loadAppointments();
        },
        error: (err) => {
          this.isSavingNotes = false;

          Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text:
              err?.error?.message ||
              err?.error ||
              'Unable to save medical record.',
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
  }

  get filteredAppointments(): any[] {
    const search = this.searchText.trim().toLowerCase();

    console.log('Filtering', this.appointments.length);

    return this.appointments.filter((appointment) => {
      const patientName = appointment.patientName?.toLowerCase() || '';
      const phone = appointment.phone?.toString() || '';
      const description = appointment.description?.toLowerCase() || '';
      const appointmentDate = appointment.appointmentDate?.toString() || '';

      const matchesSearch =
        !search ||
        patientName.includes(search) ||
        phone.includes(search) ||
        description.includes(search) ||
        appointmentDate.includes(search);

      const matchesStatus =
        !this.selectedStatus || appointment.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get pendingCount(): number {
    return this.appointments.filter((a) => a.status === 'PENDING').length;
  }

  get confirmedCount(): number {
    return this.appointments.filter((a) => a.status === 'CONFIRMED').length;
  }

  get completedCount(): number {
    return this.appointments.filter((a) => a.status === 'COMPLETED').length;
  }

  get cancelledCount(): number {
    return this.appointments.filter((a) => a.status === 'CANCELLED').length;
  }

  get todayCount(): number {
    const today = new Date().toISOString().slice(0, 10);
    return this.appointments.filter((a) => a.appointmentDate === today).length;
  }

  getStatusClass(status: string): string {
    return status ? status.toLowerCase() : '';
  }

  logout(): void {
    Swal.fire({
      icon: 'question',
      title: 'Logout?',
      text: 'Your current session will be closed.',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Stay here',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }

  openProfile(): void {
    this.showProfilePopup = true;

    if (this.loggedInUser) {
      return;
    }

    this.isProfileLoading = true;

    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.loggedInUser = res;
        this.isProfileLoading = false;
      },
      error: () => {
        this.isProfileLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Profile Load Failed',
          text: 'Unable to load doctor profile.',
          confirmButtonColor: '#0f766e',
        });
      },
    });
  }

  closeProfile(): void {
    this.showProfilePopup = false;
  }

  openAppointmentDetails(appointment: any): void {
    this.selectedAppointment = {
      ...appointment,
      diagnosis: '',
      prescription: '',
      doctorNotes: '',
      followUpDate: '',
    };

    this.showAppointmentModal = true;
    this.isMedicalRecordLoading = true;

    this.doctorService.getMedicalRecord(appointment.id).subscribe({
      next: (record: any) => {
        this.selectedAppointment.diagnosis = record?.diagnosis || '';
        this.selectedAppointment.prescription = record?.prescription || '';
        this.selectedAppointment.doctorNotes = record?.doctorNotes || '';
        this.selectedAppointment.followUpDate = record?.followUpDate || '';
        this.isMedicalRecordLoading = false;
      },
      error: () => {
        this.isMedicalRecordLoading = false;
      },
    });
  }

  closeAppointmentDetails(): void {
    if (this.isUpdating || this.isSavingNotes) {
      return;
    }

    this.showAppointmentModal = false;
    this.selectedAppointment = null;
  }
}
