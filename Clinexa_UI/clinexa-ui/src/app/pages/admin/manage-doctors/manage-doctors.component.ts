import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { DoctorService } from 'src/app/service/doctor.service';
import { DepartmentService } from 'src/app/service/department.service';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-manage-doctors',
  templateUrl: './manage-doctors.component.html',
  styleUrls: ['./manage-doctors.component.scss'],
})
export class ManageDoctorsComponent implements OnInit {
  doctors: any[] = [];
  departments: any[] = [];
  categories: any[] = [];

  searchText = '';
  selectedDepartment = '';
  selectedCategory = '';

  isLoading = false;

  constructor(
    private doctorService: DoctorService,
    private departmentService: DepartmentService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadDepartments();
    this.loadCategories();
  }

  loadDoctors(): void {
    this.isLoading = true;

    this.doctorService.getAllDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Unable to load doctors',
          text: 'Please try again after some time.',
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res;
      },
      error: (err) => {
        console.error(err);
        this.departments = [];
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res: any) => {
        this.categories = res;
      },
      error: (err) => {
        console.error(err);
        this.categories = [];
      },
    });
  }

  filteredDoctors(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.doctors.filter((doctor: any) => {
      const name = doctor.name?.toLowerCase() || '';
      const email = doctor.email?.toLowerCase() || '';

      const matchesSearch =
        !search || name.includes(search) || email.includes(search);

      const matchesDepartment =
        !this.selectedDepartment ||
        doctor.department?.name === this.selectedDepartment;

      const matchesCategory =
        !this.selectedCategory ||
        doctor.category?.name === this.selectedCategory;

      return matchesSearch && matchesDepartment && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedDepartment = '';
    this.selectedCategory = '';
  }

  deleteDoctor(id: number): void {
    const doctor = this.doctors.find((d) => d.id === id);

    Swal.fire({
      icon: 'warning',
      title: 'Deactivate Doctor?',
      text: `This will deactivate ${doctor?.name || 'this doctor'} and disable login access.`,
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

      this.doctorService.deleteDoctor(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Doctor Deactivated',
            text: 'Doctor access has been disabled successfully.',
            timer: 1400,
            showConfirmButton: false,
          });

          this.loadDoctors();
        },

        error: (err) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Action Failed',
            text:
              err?.error?.message ||
              err?.error ||
              'Unable to deactivate doctor.',
            confirmButtonColor: '#0891b2',
          });
        },
      });
    });
  }

  toggleAvailability(event: Event, doctor: any): void {
    event.stopPropagation();

    const newStatus = doctor.active ? 'Inactive' : 'Active';

    Swal.fire({
      icon: 'question',
      title: `Mark as ${newStatus}?`,
      text: `${doctor.name} will be marked as ${newStatus}.`,
      showCancelButton: true,
      confirmButtonText: `Yes, mark ${newStatus}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.doctorService.toggleAvailability(doctor.id).subscribe({
        next: (updatedDoctor: any) => {
          doctor.active = updatedDoctor.active;

          Swal.fire({
            icon: 'success',
            title: `Doctor ${updatedDoctor.active ? 'Activated' : 'Deactivated'}`,
            text: `${doctor.name} is now ${
              updatedDoctor.active ? 'available' : 'unavailable'
            }.`,
            timer: 1300,
            showConfirmButton: false,
          });

          this.loadDoctors();
        },
        error: (err) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text:
              err?.error?.message ||
              err?.error ||
              'Unable to update doctor status.',
            confirmButtonColor: '#0891b2',
          });
        },
      });
    });
  }
}
