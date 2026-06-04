import { Component, OnInit } from '@angular/core';

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

  searchText = '';

  selectedDepartment = '';

  selectedCategory = '';

  departments: any[] = [];

  categories: any[] = [];
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

  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteDoctor(id: number) {
    const confirmDelete = confirm(
      'Are you sure you want to delete this doctor?',
    );

    if (confirmDelete) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => {
          alert('Doctor deleted successfully');

          this.loadDoctors();
        },

        error: (err) => {
          console.log(err);

          alert('Failed to delete doctor');
        },
      });
    }
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res;
      },
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res: any) => {
        this.categories = res;
      },
    });
  }

  filteredDoctors() {
    return this.doctors.filter((doctor: any) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        doctor.email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesDepartment =
        this.selectedDepartment === '' ||
        doctor.department?.name === this.selectedDepartment;

      const matchesCategory =
        this.selectedCategory === '' ||
        doctor.category?.name === this.selectedCategory;

      return matchesSearch && matchesDepartment && matchesCategory;
    });
  }

  toggleAvailability(event: Event, doctor: any) {
    event.stopPropagation();

    this.doctorService.toggleAvailability(doctor.id).subscribe({
      next: (updatedDoctor: any) => {
        // update row instantly
        doctor.active = updatedDoctor.active;

        // IMPORTANT: refresh full list (keeps UI consistent)
        this.loadDoctors();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
