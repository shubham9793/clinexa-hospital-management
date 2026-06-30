import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartmentService } from 'src/app/service/department.service';

@Component({
  selector: 'app-manage-departments',
  templateUrl: './manage-departments.component.html',
  styleUrls: ['./manage-departments.component.scss'],
})
export class ManageDepartmentsComponent implements OnInit {
  departments: any[] = [];

  searchText = '';

  isLoading = false;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;

    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res || [];
        this.isLoading = false;
      },

      error: (err) => {
        console.error('Failed to load departments', err);

        this.departments = [];
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to load departments',
          text: 'Please try again after some time.',
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  filteredDepartments(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.departments.filter((dept: any) => {
      const name = dept?.name?.toLowerCase() || '';
      const description = dept?.description?.toLowerCase() || '';

      return !search || name.includes(search) || description.includes(search);
    });
  }

  clearSearch(): void {
    this.searchText = '';
  }

  editDepartment(id: number): void {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid department',
        text: 'Department information is missing.',
        confirmButtonColor: '#0891b2',
      });
      return;
    }

    this.router.navigate(['/edit-department', id]);
  }

  deleteDepartment(id: number): void {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid department',
        text: 'Department information is missing.',
        confirmButtonColor: '#0891b2',
      });
      return;
    }

    const department = this.departments.find((dept) => dept.id === id);

    Swal.fire({
      icon: 'warning',
      title: 'Delete Department?',
      text: `Are you sure you want to delete "${
        department?.name || 'this department'
      }"?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Department Deleted',
            text: 'Department was deleted successfully.',
            timer: 1500,
            showConfirmButton: false,
          });

          this.loadDepartments();
        },

        error: (err) => {
          console.error('Failed to delete department', err);

          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text:
              err?.error?.message ||
              err?.error ||
              'Unable to delete department. It may be linked with doctors.',
            confirmButtonColor: '#0891b2',
          });
        },
      });
    });
  }
}
