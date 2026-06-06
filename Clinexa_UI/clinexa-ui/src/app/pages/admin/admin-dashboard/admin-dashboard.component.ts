import { Component, OnInit } from '@angular/core';
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
  constructor(
    private doctorService: DoctorService,
    private departmentService: DepartmentService,
    private categoryService: CategoryService,
    private receptionistService: ReceptionistService,
    private activityService: ActivityService,
    private authService: AuthService,
  ) {}

  // Doctor Stats
  doctorCount = 0;
  activeDoctorCount = 0;
  inactiveDoctorCount = 0;

  // Receptionist Stats
  receptionistCount = 0;
  activeReceptionistCount = 0;
  inactiveReceptionistCount = 0;

  // Department Stats
  departmentCount = 0;
  activeDepartmentCount = 0;
  inactiveDepartmentCount = 0;

  // Category Stats
  categoryCount = 0;
  activeCategoryCount = 0;
  inactiveCategoryCount = 0;

  // Appointment Stats
  appointmentCount = 0;
  todayAppointmentCount = 0;

  // Activities
  activities: any[] = [];

  //show popup
  showProfilePopup = false;
  isProfileLoading = false;
  loggedInUser: any = null;

  ngOnInit(): void {
    this.loadStats();
  }

  logout(): void {
    this.authService.logout();
  }

  loadStats(): void {
    // Recent Activities
    this.activityService.getActivities().subscribe({
      next: (res: any) => {
        this.activities = res;
      },
      error: (err) => {
        console.error('Activities Error:', err);
      },
    });

    // Doctor Counts
    this.doctorService.getDoctorCount().subscribe((res: any) => {
      this.doctorCount = res;
    });

    this.doctorService.getActiveDoctorCount().subscribe((res: any) => {
      this.activeDoctorCount = res;
    });

    this.doctorService.getInactiveDoctorCount().subscribe((res: any) => {
      this.inactiveDoctorCount = res;
    });

    // Receptionist Counts
    this.receptionistService.getReceptionistCount().subscribe((res: any) => {
      this.receptionistCount = res;
    });

    this.receptionistService
      .getActiveReceptionistCount()
      .subscribe((res: any) => {
        this.activeReceptionistCount = res;
      });

    this.receptionistService
      .getInactiveReceptionistCount()
      .subscribe((res: any) => {
        this.inactiveReceptionistCount = res;
      });

    // Department Count
    this.departmentService.getDepartmentCount().subscribe((res: any) => {
      this.departmentCount = res;

      // Until Active/Inactive APIs are added
      this.activeDepartmentCount = res;
      this.inactiveDepartmentCount = 0;
    });

    // Category Count
    this.categoryService.getCategoryCount().subscribe((res: any) => {
      this.categoryCount = res;

      // Until Active/Inactive APIs are added
      this.activeCategoryCount = res;
      this.inactiveCategoryCount = 0;
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
        console.error('Failed to load logged-in user profile', err);
        this.isProfileLoading = false;
        alert('Unable to load profile details');
      },
    });
  }

  closeProfile(): void {
    this.showProfilePopup = false;
  }
}
