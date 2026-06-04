import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReceptionistService } from 'src/app/service/receptionist.service';

@Component({
  selector: 'app-manage-receptionists',
  templateUrl: './manage-receptionists.component.html',

  styleUrls: ['./manage-receptionists.component.scss'],
})
export class ManageReceptionistsComponent implements OnInit {
  receptionists: any[] = [];

  searchText = '';

  constructor(private receptionistService: ReceptionistService) {}

  ngOnInit(): void {
    this.loadReceptionists();
  }

  loadReceptionists() {
    this.receptionistService.getAllReceptionists().subscribe({
      next: (res: any) => {
        this.receptionists = res;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteReceptionist(id: number) {
    Swal.fire({
      title: 'Delete Receptionist?',

      text: 'This action cannot be undone.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#dc2626',

      cancelButtonColor: '#64748b',

      confirmButtonText: 'Yes, Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.receptionistService.deleteReceptionist(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Receptionist removed successfully.',
              timer: 2000,
              showConfirmButton: false,
            });
            this.loadReceptionists();
          },
        });
      }
    });
  }

  filteredReceptionists() {
    return this.receptionists.filter((r: any) =>
      r.name
        .toLowerCase()

        .includes(this.searchText.toLowerCase()),
    );
  }

  toggleStatus(id: number) {
    this.receptionistService

      .toggleStatus(id)

      .subscribe({
        next: () => {
          this.loadReceptionists();
        },
      });
  }
}
