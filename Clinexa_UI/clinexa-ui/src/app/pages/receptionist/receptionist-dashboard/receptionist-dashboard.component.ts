import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { PatientService } from 'src/app/service/patient-service.service';

@Component({
  selector: 'app-receptionist-dashboard',
  templateUrl: './receptionist-dashboard.component.html',
  styleUrls: ['./receptionist-dashboard.component.scss'],
})
export class ReceptionistDashboardComponent implements OnInit {
  patientCount = 0;
  appointmentCount = 0;
  pendingCount = 0;
  completedCount = 0;

  showProfilePopup = false;
  isProfileLoading = false;

  loggedInUser: any = null;

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.patientService.getPatientCount().subscribe({
      next: (res: any) => {
        this.patientCount = res;
      },
      error: (err) => {
        console.error('Failed to load patient count', err);
        this.patientCount = 0;
      },
    });

    // Appointment APIs will be connected later.
    this.appointmentCount = 0;
    this.pendingCount = 0;
    this.completedCount = 0;
  }

  openProfile(): void {
    this.showProfilePopup = true;

    // Avoid calling the API repeatedly after profile data is loaded.
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

  logout(): void {
    this.authService.logout();
  }
}
