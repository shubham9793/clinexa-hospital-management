import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SuperAdminService } from 'src/app/service/super-admin.service';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss'],
})
export class ManageAdminsComponent implements OnInit {
  admins: any[] = [];
  isLoading = false;

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.isLoading = true;

    this.superAdminService.getAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.isLoading = false;
      },

      error: (err) => {
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to load admins',
          text: 'Something went wrong while loading admin accounts.',
          confirmButtonColor: '#0891b2',
        });

        console.error(err);
      },
    });
  }

  toggleStatus(admin: any): void {
    const newStatus = !admin.enabled;

    Swal.fire({
      icon: 'question',
      title: newStatus ? 'Activate Admin?' : 'Deactivate Admin?',
      text: newStatus
        ? `Are you sure you want to activate ${admin.name}?`
        : `Are you sure you want to deactivate ${admin.name}?`,
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#64748b',
      confirmButtonText: newStatus ? 'Yes, activate' : 'Yes, deactivate',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.superAdminService.updateAdminStatus(admin.id, newStatus).subscribe({
        next: () => {
          admin.enabled = newStatus;

          Swal.fire({
            icon: 'success',
            title: newStatus ? 'Admin Activated' : 'Admin Deactivated',
            text: `${admin.name} has been updated successfully.`,
            timer: 1400,
            showConfirmButton: false,
          });
        },

        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Update failed',
            text: 'Unable to update admin status.',
            confirmButtonColor: '#0891b2',
          });

          console.error(err);
        },
      });
    });
  }
}
