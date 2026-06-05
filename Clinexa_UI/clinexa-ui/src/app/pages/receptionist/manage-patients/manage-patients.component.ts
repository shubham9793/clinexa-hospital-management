import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-patients',
  templateUrl: './manage-patients.component.html',
  styleUrls: ['./manage-patients.component.scss'],
})
export class ManagePatientsComponent implements OnInit {
  patients: any[] = [];
  searchText = '';

  constructor(
    private patientService: PatientService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAll().subscribe({
      next: (res: any) => {
        this.patients = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editPatient(id: number) {
    this.router.navigate(['/edit-patient', id]);
  }

  deletePatient(id: number) {
    Swal.fire({
      title: 'Delete Patient?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.deletePatient(id).subscribe({
          next: () => {
            this.loadPatients();

            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Patient deleted successfully',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            console.log(err);

            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Unable to delete patient',
            });
          },
        });
      }
    });
  }

  toggleStatus(id: number) {
    this.patientService.toggleStatus(id).subscribe({
      next: () => {
        this.loadPatients();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get filteredPatients() {
    return this.patients.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        patient.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        patient.phone?.includes(this.searchText),
    );
  }

  get activePatientsCount(): number {
    return this.patients.filter((p) => p.active).length;
  }

  get inactivePatientsCount(): number {
    return this.patients.filter((p) => !p.active).length;
  }
}
