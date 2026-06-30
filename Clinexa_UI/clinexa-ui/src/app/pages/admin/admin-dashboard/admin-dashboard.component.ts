import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { CategoryService } from 'src/app/service/category.service';
import { DepartmentService } from 'src/app/service/department.service';
import { DoctorService } from 'src/app/service/doctor.service';
import { ReceptionistService } from 'src/app/service/receptionist.service';
import { ActivityService } from 'src/app/service/activity.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  doctorCount = 0;
  activeDoctorCount = 0;
  inactiveDoctorCount = 0;

  receptionistCount = 0;
  activeReceptionistCount = 0;
  inactiveReceptionistCount = 0;

  departmentCount = 0;
  categoryCount = 0;

  appointmentCount = 0;

  activities: any[] = [];

  showProfilePopup = false;
  isProfileLoading = false;
  loggedInUser: any = null;

  isStatsLoading = false;

  constructor(
    private doctorService: DoctorService,
    private departmentService: DepartmentService,
    private categoryService: CategoryService,
    private receptionistService: ReceptionistService,
    private activityService: ActivityService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isStatsLoading = true;

    this.loadActivities();
    this.loadDoctorCounts();
    this.loadReceptionistCounts();
    this.loadDepartmentCount();
    this.loadCategoryCount();

    setTimeout(() => {
      this.isStatsLoading = false;
    }, 600);
  }

  loadActivities(): void {
    this.activityService.getActivities().subscribe({
      next: (res: any) => {
        this.activities = res || [];
      },
      error: (err) => {
        console.error('Activities Error:', err);
        this.activities = [];
      },
    });
  }

  loadDoctorCounts(): void {
    this.doctorService.getDoctorCount().subscribe({
      next: (res: any) => {
        this.doctorCount = res || 0;
      },
      error: () => {
        this.doctorCount = 0;
      },
    });

    this.doctorService.getActiveDoctorCount().subscribe({
      next: (res: any) => {
        this.activeDoctorCount = res || 0;
      },
      error: () => {
        this.activeDoctorCount = 0;
      },
    });

    this.doctorService.getInactiveDoctorCount().subscribe({
      next: (res: any) => {
        this.inactiveDoctorCount = res || 0;
      },
      error: () => {
        this.inactiveDoctorCount = 0;
      },
    });
  }

  loadReceptionistCounts(): void {
    this.receptionistService.getReceptionistCount().subscribe({
      next: (res: any) => {
        this.receptionistCount = res || 0;
      },
      error: () => {
        this.receptionistCount = 0;
      },
    });

    this.receptionistService.getActiveReceptionistCount().subscribe({
      next: (res: any) => {
        this.activeReceptionistCount = res || 0;
      },
      error: () => {
        this.activeReceptionistCount = 0;
      },
    });

    this.receptionistService.getInactiveReceptionistCount().subscribe({
      next: (res: any) => {
        this.inactiveReceptionistCount = res || 0;
      },
      error: () => {
        this.inactiveReceptionistCount = 0;
      },
    });
  }

  loadDepartmentCount(): void {
    this.departmentService.getDepartmentCount().subscribe({
      next: (res: any) => {
        this.departmentCount = res || 0;
      },
      error: () => {
        this.departmentCount = 0;
      },
    });
  }

  loadCategoryCount(): void {
    this.categoryService.getCategoryCount().subscribe({
      next: (res: any) => {
        this.categoryCount = res || 0;
      },
      error: () => {
        this.categoryCount = 0;
      },
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
      error: (err) => {
        console.error('Failed to load profile', err);
        this.isProfileLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Profile unavailable',
          text: 'Unable to load admin profile details.',
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
