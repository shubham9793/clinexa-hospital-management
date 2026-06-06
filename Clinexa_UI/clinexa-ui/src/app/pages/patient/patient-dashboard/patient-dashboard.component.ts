import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import {
  Department,
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

  loggedInUser: UserProfile | null = null;
  selectedDoctor: Doctor | null = null;

  searchText = '';
  selectedDepartmentId = '';
  selectedCategoryId = '';

  isLoading = false;

  showProfilePopup = false;
  showDoctorPopup = false;

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadDoctors();
    this.loadDepartments();
    this.loadCategories();
  }

  /* =========================
     LOAD PROFILE
  ========================= */

  loadProfile(): void {
    this.patientService.getLoggedInProfile().subscribe({
      next: (res) => {
        this.loggedInUser = res;
      },
      error: (err) => {
        console.error('Failed to load patient profile', err);
      },
    });
  }

  /* =========================
     LOAD DOCTORS
  ========================= */

  loadDoctors(): void {
    this.isLoading = true;

    this.patientService.getAvailableDoctors().subscribe({
      next: (res) => {
        this.doctors = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load available doctors', err);

        this.doctors = [];
        this.isLoading = false;
      },
    });
  }

  /* =========================
     LOAD DEPARTMENTS
  ========================= */

  loadDepartments(): void {
    this.patientService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
      },
      error: (err) => {
        console.error('Failed to load departments', err);

        this.departments = [];
      },
    });
  }

  /* =========================
     LOAD CATEGORIES
  ========================= */

  loadCategories(): void {
    this.patientService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        console.error('Failed to load categories', err);

        this.categories = [];
      },
    });
  }

  /* =========================
     FILTER DOCTORS
  ========================= */

  get filteredDoctors(): Doctor[] {
    const search = this.searchText.trim().toLowerCase();

    return this.doctors.filter((doctor) => {
      const doctorName = doctor.name?.toLowerCase() || '';

      const matchesSearch = !search || doctorName.includes(search);

      const matchesDepartment =
        !this.selectedDepartmentId ||
        doctor.department?.id === Number(this.selectedDepartmentId);

      const matchesCategory =
        !this.selectedCategoryId ||
        doctor.category?.id === Number(this.selectedCategoryId);

      return matchesSearch && matchesDepartment && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedDepartmentId = '';
    this.selectedCategoryId = '';
  }

  /* =========================
     PATIENT PROFILE POPUP
  ========================= */

  openProfile(): void {
    this.showProfilePopup = true;
  }

  closeProfile(): void {
    this.showProfilePopup = false;
  }

  /* =========================
     DOCTOR PROFILE POPUP
  ========================= */

  openDoctorProfile(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.showDoctorPopup = true;
  }

  closeDoctorProfile(): void {
    this.showDoctorPopup = false;
    this.selectedDoctor = null;
  }

  /* =========================
     BOOKING PLACEHOLDER
  ========================= */

  startBooking(doctor: Doctor | null): void {
    if (!doctor) {
      return;
    }

    this.closeDoctorProfile();

    alert(`Appointment booking form for ${doctor.name} will be added next.`);
  }



  logout(): void {
    this.authService.logout();
  }
}
