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
  isLoading = false;

  constructor(private receptionistService: ReceptionistService) {}

  ngOnInit(): void {
    this.loadReceptionists();
  }

  loadReceptionists(): void {
    this.isLoading = true;

    this.receptionistService.getAllReceptionists().subscribe({
      next: (res: any) => {
        this.receptionists = res || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load receptionists', err);
        this.receptionists = [];
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to load receptionists',
          text: 'Please try again after some time.',
          confirmButtonColor: '#7c3aed',
        });
      },
    });
  }

  filteredReceptionists(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.receptionists.filter((r: any) => {
      const name = r.name?.toLowerCase() || '';
      const email = r.email?.toLowerCase() || '';
      const phone = r.phone?.toLowerCase() || '';

      return (
        !search ||
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search)
      );
    });
  }

  clearSearch(): void {
    this.searchText = '';
  }

  deleteReceptionist(id: number): void {
    const receptionist = this.receptionists.find((r) => r.id === id);

    Swal.fire({
      icon: 'warning',
      title: 'Deactivate Receptionist?',
      text: `This will deactivate ${
        receptionist?.name || 'this receptionist'
      } and disable login access.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, deactivate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.receptionistService.deleteReceptionist(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Receptionist Deactivated',
            text: 'Receptionist access has been disabled successfully.',
            timer: 1500,
            showConfirmButton: false,
          });

          this.loadReceptionists();
        },
        error: (err) => {
          console.error('Failed to deactivate receptionist', err);

          Swal.fire({
            icon: 'error',
            title: 'Action Failed',
            text:
              err?.error?.message ||
              err?.error ||
              'Unable to deactivate receptionist.',
            confirmButtonColor: '#7c3aed',
          });
        },
      });
    });
  }

  toggleStatus(receptionist: any): void {
    if (!receptionist?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Receptionist',
        text: 'Receptionist data is missing.',
        confirmButtonColor: '#7c3aed',
      });
      return;
    }

    const newStatus = receptionist.active ? 'Inactive' : 'Active';

    Swal.fire({
      icon: 'question',
      title: `Mark as ${newStatus}?`,
      text: `${receptionist.name || 'Receptionist'} will be marked as ${newStatus}.`,
      showCancelButton: true,
      confirmButtonText: `Yes, mark ${newStatus}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.receptionistService.toggleStatus(receptionist.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: `Receptionist ${newStatus}`,
            text: `${receptionist.name || 'Receptionist'} is now ${newStatus}.`,
            timer: 1300,
            showConfirmButton: false,
          });

          this.loadReceptionists();
        },
        error: (err) => {
          console.error('Failed to update receptionist status', err);

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text:
              err?.error?.message ||
              err?.error ||
              'Unable to update receptionist status.',
            confirmButtonColor: '#7c3aed',
          });
        },
      });
    });
  }
}
