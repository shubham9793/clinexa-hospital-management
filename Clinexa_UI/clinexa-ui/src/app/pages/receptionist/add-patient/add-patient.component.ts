import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PatientService } from 'src/app/service/patient-service.service';
import { getErrorMessage } from 'src/app/shared/utils/error-message.util';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
})
export class AddPatientComponent implements OnInit {
  patientId: number | null = null;

  isEditMode = false;
  isSubmitting = false;
  isLoading = false;

  maxDate = new Date().toISOString().split('T')[0];

  patient = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    active: true,
  };

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.patientId = Number(id);
      this.isEditMode = true;
      this.loadPatient();
    }
  }

  loadPatient(): void {
    if (!this.patientId) {
      return;
    }

    this.isLoading = true;

    this.patientService.getById(this.patientId).subscribe({
      next: (res: any) => {
        this.patient = {
          name: res.name || '',
          email: res.email || '',
          phone: res.phone || '',
          gender: res.gender || '',
          dob: res.dob || '',
          address: res.address || '',
          active: res.active ?? true,
        };

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Patient',
          text:  getErrorMessage(err),
          confirmButtonColor: '#2563eb',
        }).then(() => {
          this.router.navigate(['/manage-patients']);
        });
      },
    });
  }

  savePatient(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    const payload = {
      name: this.patient.name.trim(),
      email: this.patient.email.trim().toLowerCase(),
      phone: this.patient.phone.trim(),
      gender: this.patient.gender,
      dob: this.patient.dob,
      address: this.patient.address.trim(),
      active: this.patient.active,
    };

    const request =
      this.isEditMode && this.patientId
        ? this.patientService.updatePatient(this.patientId, payload)
        : this.patientService.create(payload);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Patient Updated' : 'Patient Created',
          text: this.isEditMode
            ? 'Patient information updated successfully.'
            : 'New patient registered successfully.',
          timer: 1600,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/manage-patients']);
        });
      },
      error: (err) => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'error',
          title: this.isEditMode ? 'Update Failed' : 'Creation Failed',
          text: getErrorMessage(err),
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }

  validateForm(): boolean {
    const name = this.patient.name.trim();
    const email = this.patient.email.trim();
    const phone = this.patient.phone.trim();
    const address = this.patient.address.trim();

    if (!name) {
      this.showWarning('Patient name is required.');
      return false;
    }

    if (name.length < 3) {
      this.showWarning('Patient name must contain at least 3 characters.');
      return false;
    }

    if (!email) {
      this.showWarning('Patient email is required.');
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.showWarning('Please enter a valid email address.');
      return false;
    }

    if (!phone) {
      this.showWarning('Patient phone number is required.');
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      this.showWarning('Phone number must contain exactly 10 digits.');
      return false;
    }

    if (!this.patient.gender) {
      this.showWarning('Please select patient gender.');
      return false;
    }

    if (!this.patient.dob) {
      this.showWarning('Please select date of birth.');
      return false;
    }

    if (this.patient.dob > this.maxDate) {
      this.showWarning('Date of birth cannot be in the future.');
      return false;
    }

    if (!address) {
      this.showWarning('Patient address is required.');
      return false;
    }

    if (address.length < 5) {
      this.showWarning('Please enter a valid address.');
      return false;
    }

    return true;
  }

  goBack(): void {
    this.router.navigate(['/manage-patients']);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Required Information',
      text: message,
      confirmButtonColor: '#2563eb',
    });
  }
}
