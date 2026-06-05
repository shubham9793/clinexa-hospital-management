import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient-service.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
})
export class AddPatientComponent implements OnInit {
  patientId!: number;

  isEditMode = false;

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
      this.isEditMode = true;

      this.patientId = Number(id);

      this.patientService.getById(this.patientId).subscribe({
        next: (res: any) => {
          this.patient = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  savePatient() {
    if (this.isEditMode) {
      this.patientService
        .updatePatient(this.patientId, this.patient)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Patient Updated',
              text: 'Patient updated successfully',
              timer: 2000,
              showConfirmButton: false,
            });

            this.router.navigate(['/manage-patients']);
          },

          error: (err) => {
            console.log(err);

            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'Unable to update patient',
            });
          },
        });
    } else {
      this.patientService.create(this.patient).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Patient Created',
            text: 'Patient created successfully',
            timer: 2000,
            showConfirmButton: false,
          });

          this.router.navigate(['/manage-patients']);
        },

        error: (err) => {
          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Creation Failed',
            text: 'Unable to create patient',
          });
        },
      });
    }
  }
}
