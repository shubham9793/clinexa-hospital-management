import { Component, OnInit } from '@angular/core';
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

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.patientService.getPatientCount().subscribe((res: any) => {
      this.patientCount = res;
    });

    // Appointment APIs later
    this.appointmentCount = 0;

    this.pendingCount = 0;

    this.completedCount = 0;
  }
}
