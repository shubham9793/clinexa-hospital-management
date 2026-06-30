import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

import { AuthService } from 'src/app/service/auth.service';
import {
  Appointment,
  AppointmentRequest,
  Department,
  MedicalRecord,
  Doctor,
  DoctorCategory,
  PatientService,
  UserProfile,
} from 'src/app/service/patient-service.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
})
export class PatientDashboardComponent implements OnInit {
  doctors: Doctor[] = [];
  departments: Department[] = [];
  categories: DoctorCategory[] = [];
  appointments: Appointment[] = [];

  loggedInUser: UserProfile | null = null;
  selectedDoctor: Doctor | null = null;

  searchText = '';
  selectedDepartmentId = '';
  selectedCategoryId = '';

  today = new Date().toISOString().split('T')[0];

  isProfileLoading = false;
  isDoctorsLoading = false;
  isAppointmentsLoading = false;
  isBookingSubmitting = false;

  showProfilePopup = false;
  showDoctorPopup = false;
  showBookingPopup = false;

  showAppointmentPopup = false;
  selectedAppointment: Appointment | null = null;
  selectedMedicalRecord: MedicalRecord | null = null;
  isMedicalRecordLoading = false;

  medicalHistory: MedicalRecord[] = [];
  isMedicalHistoryLoading = false;

  bookingForm: AppointmentRequest = {
    doctorId: 0,
    patientName: '',
    age: undefined,
    gender: '',
    phone: '',
    description: '',
    appointmentDate: '',
    slotTime: '',
  };

  // rescheduleForm

  showReschedulePopup = false;
  rescheduleAppointmentData: Appointment | null = null;

  rescheduleForm = {
    doctorId: '',
    appointmentDate: '',
    slotTime: '',
  };

  isRescheduling = false;

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadDoctors();
    this.loadDepartments();
    this.loadCategories();
    this.loadAppointments();
    this.loadMedicalHistory();
  }

  loadProfile(): void {
    this.isProfileLoading = true;

    this.patientService.getLoggedInProfile().subscribe({
      next: (res) => {
        this.loggedInUser = res;
        this.isProfileLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.isProfileLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Profile Load Failed',
          text: 'Unable to load your profile details.',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openReschedulePopup(appointment: any): void {
    if (appointment.status !== 'PENDING') {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Reschedule',
        text: 'You can reschedule only pending appointments.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.rescheduleAppointmentData = appointment;

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
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const payload = {
      doctorId: Number(this.rescheduleForm.doctorId),
      appointmentDate: this.rescheduleForm.appointmentDate,
      slotTime: this.rescheduleForm.slotTime,
    };

    this.isRescheduling = true;

    this.patientService
      .rescheduleMyAppointment(this.rescheduleAppointmentData.id, payload)
      .subscribe({
        next: () => {
          this.isRescheduling = false;

          Swal.fire({
            icon: 'success',
            title: 'Appointment Rescheduled',
            text: 'Your appointment has been updated successfully.',
            timer: 1600,
            showConfirmButton: false,
          });

          this.closeReschedulePopup();
          this.loadAppointments();
        },
        error: (err) => {
          this.isRescheduling = false;

          Swal.fire({
            icon: 'error',
            title: 'Reschedule Failed',
            text:
              err?.error?.message ||
              err?.error ||
              'Unable to reschedule appointment.',
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  loadDoctors(): void {
    this.isDoctorsLoading = true;

    this.patientService.getAvailableDoctors().subscribe({
      next: (res) => {
        this.doctors = res || [];
        this.isDoctorsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load doctors', err);
        this.doctors = [];
        this.isDoctorsLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Doctors',
          text: 'Please try again after some time.',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  loadDepartments(): void {
    this.patientService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res || [];
      },
      error: (err) => {
        console.error('Failed to load departments', err);
        this.departments = [];
      },
    });
  }

  loadCategories(): void {
    this.patientService.getCategories().subscribe({
      next: (res) => {
        this.categories = res || [];
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.categories = [];
      },
    });
  }

  loadAppointments(): void {
    this.isAppointmentsLoading = true;

    this.patientService.getMyAppointments().subscribe({
      next: (res) => {
        this.appointments = res || [];
        this.isAppointmentsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.appointments = [];
        this.isAppointmentsLoading = false;
      },
    });
  }

  get filteredDoctors(): Doctor[] {
    const search = this.searchText.trim().toLowerCase();

    return this.doctors.filter((doctor) => {
      const doctorName = doctor.name?.toLowerCase() || '';
      const departmentName = doctor.department?.name?.toLowerCase() || '';
      const categoryName = doctor.category?.name?.toLowerCase() || '';

      const matchesSearch =
        !search ||
        doctorName.includes(search) ||
        departmentName.includes(search) ||
        categoryName.includes(search);

      const matchesDepartment =
        !this.selectedDepartmentId ||
        doctor.department?.id === Number(this.selectedDepartmentId);

      const matchesCategory =
        !this.selectedCategoryId ||
        doctor.category?.id === Number(this.selectedCategoryId);

      return matchesSearch && matchesDepartment && matchesCategory;
    });
  }

  get upcomingAppointments(): Appointment[] {
    return this.appointments.filter(
      (appointment) =>
        appointment.status === 'PENDING' || appointment.status === 'CONFIRMED',
    );
  }

  get completedAppointmentsCount(): number {
    return this.appointments.filter(
      (appointment) => appointment.status === 'COMPLETED',
    ).length;
  }

  get cancelledAppointmentsCount(): number {
    return this.appointments.filter(
      (appointment) => appointment.status === 'CANCELLED',
    ).length;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedDepartmentId = '';
    this.selectedCategoryId = '';
  }

  openProfile(): void {
    this.showProfilePopup = true;
  }

  closeProfile(): void {
    this.showProfilePopup = false;
  }

  openDoctorProfile(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.showDoctorPopup = true;
  }

  closeDoctorProfile(): void {
    this.showDoctorPopup = false;
    this.selectedDoctor = null;
  }

  startBooking(doctor: Doctor | null): void {
    if (!doctor?.id) {
      this.showError('Invalid Doctor', 'Doctor information is missing.');
      return;
    }

    this.selectedDoctor = doctor;
    this.showDoctorPopup = false;

    this.bookingForm = {
      doctorId: doctor.id,
      patientName: this.loggedInUser?.name || '',
      age: undefined,
      gender: '',
      phone: this.loggedInUser?.phone || '',
      description: '',
      appointmentDate: '',
      slotTime: '',
    };

    this.showBookingPopup = true;
  }

  closeBooking(): void {
    if (this.isBookingSubmitting) {
      return;
    }

    this.showBookingPopup = false;
    this.selectedDoctor = null;
  }

  submitBooking(): void {
    const phoneRegex = /^[0-9]{10}$/;

    if (!this.bookingForm.patientName?.trim()) {
      this.showWarning('Patient name is required.');
      return;
    }

    if (!this.bookingForm.phone?.trim()) {
      this.showWarning('Phone number is required.');
      return;
    }

    if (!phoneRegex.test(this.bookingForm.phone.trim())) {
      this.showWarning('Phone number must contain exactly 10 digits.');
      return;
    }

    if (
      !this.bookingForm.age ||
      this.bookingForm.age < 1 ||
      this.bookingForm.age > 120
    ) {
      this.showWarning('Please enter a valid age.');
      return;
    }

    if (!this.bookingForm.gender) {
      this.showWarning('Please select gender.');
      return;
    }

    if (!this.bookingForm.appointmentDate) {
      this.showWarning('Please select appointment date.');
      return;
    }

    if (this.bookingForm.appointmentDate < this.today) {
      this.showWarning('Appointment date cannot be in the past.');
      return;
    }

    if (!this.bookingForm.slotTime) {
      this.showWarning('Please select appointment time.');
      return;
    }

    if (!this.bookingForm.description?.trim()) {
      this.showWarning('Please enter appointment reason.');
      return;
    }

    this.isBookingSubmitting = true;

    const payload: AppointmentRequest = {
      ...this.bookingForm,
      patientName: this.bookingForm.patientName.trim(),
      phone: this.bookingForm.phone.trim(),
      description: this.bookingForm.description.trim(),
    };

    this.patientService.bookMyAppointment(payload).subscribe({
      next: () => {
        this.isBookingSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: 'Appointment Booked',
          text: 'Your appointment has been booked successfully.',
          timer: 1800,
          showConfirmButton: false,
        });

        this.closeBooking();
        this.loadAppointments();
      },
      error: (err) => {
        this.isBookingSubmitting = false;

        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text:
            err?.error?.message || err?.error || 'Appointment booking failed.',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }

  cancelAppointment(appointmentId: number): void {
    if (!appointmentId) {
      this.showError(
        'Invalid Appointment',
        'Appointment information is missing.',
      );
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Cancel Appointment?',
      text: 'Are you sure you want to cancel this appointment?',
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

      this.patientService.cancelMyAppointment(appointmentId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Appointment Cancelled',
            text: 'Your appointment has been cancelled.',
            timer: 1600,
            showConfirmButton: false,
          });

          this.loadAppointments();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Cancellation Failed',
            text:
              err?.error?.message ||
              err?.error ||
              'Failed to cancel appointment.',
            confirmButtonColor: '#dc2626',
          });
        },
      });
    });
  }

  openAppointmentDetails(appointment: Appointment): void {
    if (!appointment?.id) {
      this.showError(
        'Invalid Appointment',
        'Appointment information is missing.',
      );
      return;
    }

    this.selectedAppointment = appointment;
    this.selectedMedicalRecord = null;
    this.showAppointmentPopup = true;

    if (appointment.status !== 'COMPLETED') {
      return;
    }

    this.isMedicalRecordLoading = true;

    this.patientService.getMedicalRecord(appointment.id).subscribe({
      next: (record) => {
        console.log('Medical Record', record);
        this.selectedMedicalRecord = record;
        this.isMedicalRecordLoading = false;
      },
      error: (err) => {
        console.log('Medical Record Error', err);
        this.selectedMedicalRecord = null;
        this.isMedicalRecordLoading = false;
      },
    });
  }

  closeAppointmentDetails(): void {
    this.showAppointmentPopup = false;
    this.selectedAppointment = null;
    this.selectedMedicalRecord = null;
    this.isMedicalRecordLoading = false;
  }

  downloadPrescriptionPdf(event?: Event): void {
    event?.stopPropagation();

    if (!this.selectedAppointment || !this.selectedMedicalRecord) {
      Swal.fire({
        icon: 'warning',
        title: 'Prescription Not Available',
        text: 'Medical record is not available for this appointment.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    if (this.selectedAppointment.status !== 'COMPLETED') {
      Swal.fire({
        icon: 'info',
        title: 'Appointment Not Completed',
        text: 'Prescription can be downloaded after the appointment is completed.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    let y = 16;

    const patientName =
      this.loggedInUser?.name ||
      this.selectedAppointment.patientName ||
      'Patient';

    const safeFileName = patientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    doc.setFillColor(8, 145, 178);
    doc.rect(0, 0, pageWidth, 34, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINEXA HOSPITAL', margin, 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Digital Prescription & Medical Record', margin, 22);
    doc.text('Generated by Clinexa Patient Portal', margin, 28);

    y = 46;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Prescription Summary', margin, y);

    y += 9;

    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, pageWidth - margin, y);

    y += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Details', margin, y);
    doc.text('Doctor Details', 112, y);

    y += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(`Name: ${patientName}`, margin, y);
    doc.text(
      `Doctor: ${this.selectedAppointment.doctor?.name || 'Not available'}`,
      112,
      y,
    );

    y += 6;

    doc.text(
      `Phone: ${this.loggedInUser?.phone || this.selectedAppointment.phone || 'Not available'}`,
      margin,
      y,
    );
    doc.text(
      `Department: ${this.selectedAppointment.doctor?.department?.name || 'Not assigned'}`,
      112,
      y,
    );

    y += 6;

    doc.text(
      `Age: ${this.selectedAppointment.age || 'Not available'}`,
      margin,
      y,
    );
    doc.text(`Appointment ID: ${this.selectedAppointment.id}`, 112, y);

    y += 6;

    doc.text(
      `Gender: ${this.selectedAppointment.gender || 'Not available'}`,
      margin,
      y,
    );
    doc.text(`Status: ${this.selectedAppointment.status}`, 112, y);

    y += 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Appointment Details', margin, y);

    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(
      `Date: ${this.selectedAppointment.appointmentDate || 'Not available'}`,
      margin,
      y,
    );
    doc.text(
      `Time: ${this.selectedAppointment.slotTime || 'Not available'}`,
      80,
      y,
    );

    y += 6;

    y = this.addWrappedText(
      doc,
      'Reason',
      this.selectedAppointment.description || 'Not provided',
      margin,
      y,
      pageWidth - margin * 2,
    );

    y += 4;

    y = this.addWrappedText(
      doc,
      'Diagnosis',
      this.selectedMedicalRecord.diagnosis || 'Not provided',
      margin,
      y,
      pageWidth - margin * 2,
    );

    y += 3;

    y = this.addWrappedText(
      doc,
      'Prescription',
      this.selectedMedicalRecord.prescription || 'Not provided',
      margin,
      y,
      pageWidth - margin * 2,
    );

    y += 3;

    y = this.addWrappedText(
      doc,
      'Doctor Notes',
      this.selectedMedicalRecord.doctorNotes || 'Not provided',
      margin,
      y,
      pageWidth - margin * 2,
    );

    y += 3;

    y = this.addWrappedText(
      doc,
      'Follow Up Date',
      this.selectedMedicalRecord.followUpDate || 'Not provided',
      margin,
      y,
      pageWidth - margin * 2,
    );

    doc.setDrawColor(203, 213, 225);
    doc.line(margin, 278, pageWidth - margin, 278);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'This is a digitally generated prescription from Clinexa.',
      margin,
      284,
    );
    doc.text(
      'Please consult your doctor before changing any medicine or dosage.',
      margin,
      289,
    );

    doc.save(
      `clinexa_prescription_${safeFileName}_${this.selectedAppointment.id}.pdf`,
    );
  }

  private addWrappedText(
    doc: jsPDF,
    title: string,
    value: string,
    x: number,
    y: number,
    maxWidth: number,
  ): number {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title, x, y);

    y += 6;

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const lines = doc.splitTextToSize(value, maxWidth);
    doc.text(lines, x, y);

    return y + lines.length * 5 + 4;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'pending';
      case 'CONFIRMED':
        return 'confirmed';
      case 'CANCELLED':
        return 'cancelled';
      case 'COMPLETED':
        return 'completed';
      default:
        return '';
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
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

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Required Information',
      text: message,
      confirmButtonColor: '#2563eb',
    });
  }

  private showError(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#2563eb',
    });
  }

  loadMedicalHistory(): void {
    this.isMedicalHistoryLoading = true;

    this.patientService.getMyMedicalHistory().subscribe({
      next: (res) => {
        this.medicalHistory = res || [];
        this.isMedicalHistoryLoading = false;
      },
      error: (err) => {
        console.error('Failed to load medical history', err);
        this.medicalHistory = [];
        this.isMedicalHistoryLoading = false;
      },
    });
  }
}
