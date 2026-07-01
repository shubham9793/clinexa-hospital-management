import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PatientService } from 'src/app/service/patient-service.service';
import { getErrorMessage } from 'src/app/shared/utils/error-message.util';

@Component({
  selector: 'app-manage-patients',
  templateUrl: './manage-patients.component.html',
  styleUrls: ['./manage-patients.component.scss'],
})
export class ManagePatientsComponent implements OnInit {
  patients: any[] = [];
  searchText = '';
  isLoading = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;

    this.patientService.getAll().subscribe({
      next: (res: any) => {
        this.patients = res || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load patients', err);
        this.patients = [];
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Patients',
          text:  getErrorMessage(err),
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  editPatient(id: number): void {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Patient',
        text: 'Patient information is missing.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.router.navigate(['/edit-patient', id]);
  }

  deletePatient(id: number): void {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Patient',
        text: 'Patient information is missing.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const patient = this.patients.find((p) => p.id === id);

    Swal.fire({
      title: 'Delete Patient?',
      html: `
        ${patient?.name ? `<b>${patient.name}</b><br><br>` : ''}
        This patient record will be removed permanently.
        <br><br>
        <b>This action cannot be undone.</b>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete Patient',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.patientService.deletePatient(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Patient Deleted',
            text: 'Patient removed successfully.',
            timer: 1600,
            showConfirmButton: false,
          });

          this.loadPatients();
        },
        error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: getErrorMessage(err),
              confirmButtonColor: '#dc2626',
            });
        },
      });
    });
  }

  toggleStatus(patient: any): void {
    if (!patient?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Patient',
        text: 'Patient information is missing.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const nextStatus = patient.active ? 'Inactive' : 'Active';

    Swal.fire({
      icon: 'question',
      title: `Mark as ${nextStatus}?`,
      text: `${patient.name || 'Patient'} will be marked as ${nextStatus}.`,
      showCancelButton: true,
      confirmButtonText: `Yes, mark ${nextStatus}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.patientService.toggleStatus(patient.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Status Updated',
            text: `Patient marked as ${nextStatus}.`,
            timer: 1400,
            showConfirmButton: false,
          });

          this.loadPatients();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: getErrorMessage(err),
            confirmButtonColor: '#dc2626',
          });
        },
      });
    });
  }

  clearSearch(): void {
    this.searchText = '';
  }

  get filteredPatients(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.patients.filter((patient: any) => {
      const name = patient.name?.toLowerCase() || '';
      const email = patient.email?.toLowerCase() || '';
      const phone = patient.phone?.toString() || '';
      const gender = patient.gender?.toLowerCase() || '';
      const address = patient.address?.toLowerCase() || '';

      return (
        !search ||
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        gender.includes(search) ||
        address.includes(search)
      );
    });
  }

  get activePatientsCount(): number {
    return this.patients.filter((p) => p.active).length;
  }

  get inactivePatientsCount(): number {
    return this.patients.filter((p) => !p.active).length;
  }
}
