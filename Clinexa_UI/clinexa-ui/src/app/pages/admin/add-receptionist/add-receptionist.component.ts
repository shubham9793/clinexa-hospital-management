import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReceptionistService } from 'src/app/service/receptionist.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-receptionist',
  templateUrl: './add-receptionist.component.html',
  styleUrls: ['./add-receptionist.component.scss'],
})
export class AddReceptionistComponent {
  receptionist = {
    name: '',

    email: '',

    phone: '',

    password: '',
  };

  isEdit = false;

  receptionistId: any;

  constructor(
    private receptionistService: ReceptionistService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.receptionistId = this.route.snapshot.params['id'];
  console.log(this.receptionistId);
    if (this.receptionistId) {
      this.isEdit = true;

      this.loadReceptionist();
    }
  }

  saveReceptionist() {
    if (this.isEdit) {
      this.receptionistService
        .updateReceptionist(this.receptionistId, this.receptionist)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Receptionist Updated',
              text: 'Details updated successfully.',
              confirmButtonColor: '#2563eb',
              background: '#ffffff',
              color: '#1e293b',
              timer: 2000,
              showConfirmButton: false,
            });

            this.router.navigate(['/manage-receptionists']);
          },
        });
    } else {
      this.receptionistService.createReceptionist(this.receptionist).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Receptionist Created',
            text: 'Receptionist added successfully.',
            confirmButtonColor: '#2563eb',
            background: '#ffffff',
            color: '#1e293b',
            timer: 2000,
            showConfirmButton: false,
          });

          this.router.navigate(['/manage-receptionists']);
        },
      });
    }
  }

  loadReceptionist() {
    this.receptionistService
      .getReceptionistById(this.receptionistId)
      .subscribe({
        next: (res: any) => {
          this.receptionist = res;
        },
      });
  }
}
