import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';
import {
  Doctor,
  PatientService,
} from 'src/app/service/patient-service.service';
import { ReceptionistService } from 'src/app/service/receptionist.service';
import { getErrorMessage } from 'src/app/shared/utils/error-message.util';

@Component({
  selector: 'app-receptionist-dashboard',
  templateUrl: './receptionist-dashboard.component.html',
  styleUrls: ['./receptionist-dashboard.component.scss'],
})
export class ReceptionistDashboardComponent implements OnInit {
  patientCount = 0;
  appointmentCount = 0;
  pendingCount = 0;
  confirmedCount = 0;
  completedCount = 0;
  cancelledCount = 0;
  todayCount = 0;

  appointments: any[] = [];
  doctors: Doctor[] = [];

  searchText = '';
  selectedStatus = '';

  isStatsLoading = false;
  isAppointmentsLoading = false;
  isFollowUpLoading = false;
  isProfileLoading = false;
  isRescheduling = false;

  showProfilePopup = false;
  loggedInUser: any = null;

  showAppointmentPopup = false;
  selectedAppointment: any = null;
  selectedFollowUpDate = '';

  showReschedulePopup = false;
  rescheduleAppointmentData: any = null;

  today = new Date().toISOString().split('T')[0];

  rescheduleForm = {
    doctorId: '',
    appointmentDate: '',
    slotTime: '',
  };

  constructor(
    private patientService: PatientService,
    private receptionistService: ReceptionistService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadDoctors();
  }

  loadDashboard(): void {
    this.loadStats();
    this.loadAppointments();
  }

  loadDoctors(): void {
    this.patientService.getAvailableDoctors().subscribe({
      next: (res) => {
        this.doctors = res || [];
      },
      error: (err) => {
        getErrorMessage(err)
        this.doctors = [];
      },
    });
  }

  loadStats(): void {
    this.isStatsLoading = true;

    this.patientService.getPatientCount().subscribe({
      next: (res: any) => {
        this.patientCount = res || 0;
        this.isStatsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load patient count', err);
        this.patientCount = 0;
        this.isStatsLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Unable to load dashboard',
          text:  getErrorMessage(err),
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  loadAppointments(): void {
    this.isAppointmentsLoading = true;

    this.receptionistService.getAllAppointments().subscribe({
      next: (res: any[]) => {
        this.appointments = Array.isArray(res) ? res : [];
        this.calculateAppointmentStats();
        this.isAppointmentsLoading = false;
      },
      error: (err) => {
        this.appointments = [];
        this.calculateAppointmentStats();
        this.isAppointmentsLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to load appointments',
          text:  getErrorMessage(err),
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  calculateAppointmentStats(): void {
    const today = new Date().toISOString().slice(0, 10);

    this.appointmentCount = this.appointments.length;
    this.pendingCount = this.appointments.filter(
      (a) => a.status === 'PENDING',
    ).length;
    this.confirmedCount = this.appointments.filter(
      (a) => a.status === 'CONFIRMED',
    ).length;
    this.completedCount = this.appointments.filter(
      (a) => a.status === 'COMPLETED',
    ).length;
    this.cancelledCount = this.appointments.filter(
      (a) => a.status === 'CANCELLED',
    ).length;
    this.todayCount = this.appointments.filter(
      (a) => a.appointmentDate === today,
    ).length;
  }

  get filteredAppointments(): any[] {
    const search = (this.searchText || '').trim().toLowerCase();
    const status = (this.selectedStatus || '').trim();

    return this.appointments.filter((appointment) => {
      const patientName = (appointment.patientName || '').toLowerCase();
      const phone = (appointment.phone || '').toString();
      const doctorName = (appointment.doctor?.name || '').toLowerCase();
      const departmentName = (
        appointment.doctor?.department?.name || ''
      ).toLowerCase();
      const date = (appointment.appointmentDate || '').toString();

      const matchesSearch =
        !search ||
        patientName.includes(search) ||
        phone.includes(search) ||
        doctorName.includes(search) ||
        departmentName.includes(search) ||
        date.includes(search);

      const matchesStatus = !status || appointment.status === status;

      return matchesSearch && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
  }

  scrollToAppointments(): void {
    const element = document.getElementById('receptionistAppointments');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  openAppointmentDetails(appointment: any): void {
    if (!appointment) {
      return;
    }

    this.showReschedulePopup = false;
    this.rescheduleAppointmentData = null;

    this.selectedAppointment = { ...appointment };
    this.selectedFollowUpDate = '';
    this.isFollowUpLoading = false;
    this.showAppointmentPopup = true;

    if (appointment.status !== 'COMPLETED') {
      return;
    }

    this.isFollowUpLoading = true;

    this.receptionistService.getMedicalRecord(appointment.id).subscribe({
      next: (record: any) => {
        this.selectedFollowUpDate = record?.followUpDate || '';
        this.isFollowUpLoading = false;
      },
      error: () => {
        this.selectedFollowUpDate = '';
        this.isFollowUpLoading = false;
      },
    });
  }

  closeAppointmentDetails(): void {
    this.showAppointmentPopup = false;
    this.selectedAppointment = null;
    this.selectedFollowUpDate = '';
    this.isFollowUpLoading = false;
  }

  openReschedulePopup(appointment: any): void {
    if (!appointment) {
      return;
    }

    if (
      appointment.status === 'COMPLETED' ||
      appointment.status === 'CANCELLED'
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Reschedule',
        text: 'Completed or cancelled appointments cannot be rescheduled.',
        confirmButtonColor: '#0891b2',
      });
      return;
    }

    this.showAppointmentPopup = false;
    this.selectedAppointment = null;

    this.rescheduleAppointmentData = { ...appointment };

    this.rescheduleForm = {
      doctorId: appointment.doctor?.id || '',
      appointmentDate: appointment.appointmentDate || '',
      slotTime: appointment.slotTime || '',
    };

    this.showReschedulePopup = true;
  }

  closeReschedulePopup(): void {
    if (this.isRescheduling) {
      return;
    }

    this.showReschedulePopup = false;
    this.rescheduleAppointmentData = null;
  }

  submitReschedule(): void {
    if (!this.rescheduleAppointmentData?.id) {
      return;
    }

    if (
      !this.rescheduleForm.doctorId ||
      !this.rescheduleForm.appointmentDate ||
      !this.rescheduleForm.slotTime
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please select doctor, date and time.',
        confirmButtonColor: '#0891b2',
      });
      return;
    }

    const payload = {
      doctorId: Number(this.rescheduleForm.doctorId),
      appointmentDate: this.rescheduleForm.appointmentDate,
      slotTime: this.rescheduleForm.slotTime,
    };

    this.isRescheduling = true;

    this.receptionistService
      .rescheduleAppointment(this.rescheduleAppointmentData.id, payload)
      .subscribe({
        next: () => {
          this.isRescheduling = false;

          Swal.fire({
            icon: 'success',
            title: 'Appointment Rescheduled',
            text: 'Appointment updated successfully.',
            timer: 1600,
            showConfirmButton: false,
          });

          this.closeReschedulePopup();
          this.loadDashboard();
        },
        error: (err) => {
          this.isRescheduling = false;

          Swal.fire({
            icon: 'error',
            title: 'Reschedule Failed',
            text:  getErrorMessage(err),
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  cancelAppointment(appointmentId: number): void {
    if (!appointmentId) {
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Cancel Appointment?',
      text: 'This appointment will be cancelled.',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.receptionistService.cancelAppointment(appointmentId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Appointment Cancelled',
            timer: 1500,
            showConfirmButton: false,
          });

          this.closeAppointmentDetails();
          this.closeReschedulePopup();
          this.loadDashboard();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Cancellation Failed',
            text:  getErrorMessage(err),
            confirmButtonColor: '#dc2626',
          });
        },
      });
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'pending';
      case 'CONFIRMED':
        return 'confirmed';
      case 'COMPLETED':
        return 'completed';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return '';
    }
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
      error: (err) => {
        this.isProfileLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Profile unavailable',
          text: getErrorMessage(err),
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  closeProfile(): void {
    this.showProfilePopup = false;
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
}
