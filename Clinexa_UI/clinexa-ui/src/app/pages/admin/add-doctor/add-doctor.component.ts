import { Component, OnInit } from '@angular/core';

import { DoctorService } from 'src/app/service/doctor.service';

import { DepartmentService } from 'src/app/service/department.service';

import { CategoryService } from 'src/app/service/category.service';

import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
})
export class AddDoctorComponent implements OnInit {
  doctor = {
    name: '',
    email: '',
    phone: '',
    password: '',
    departmentId: '',
    categoryId: '',
  };

  departments: any[] = [];
  categories: any[] = [];

  doctorId: any;

  isEditMode = false;

  constructor(
    private doctorService: DoctorService,
    private departmentService: DepartmentService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCategories();

    this.doctorId = this.route.snapshot.params['id'];

    if (this.doctorId) {
      this.isEditMode = true;

      this.loadDoctorById();
    }
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe((res: any) => {
      this.departments = res;
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res: any) => {
      this.categories = res;
    });
  }

  createDoctor() {
    if (this.isEditMode) {
      this.doctorService.updateDoctor(this.doctorId, this.doctor).subscribe({
        next: () => {
          alert('Doctor updated');

          this.router.navigate(['/manage-doctors']);
        },

        error: (err) => {
          console.log(err);

          alert('Update failed');
        },
      });
    } else {
      this.doctorService.createDoctor(this.doctor).subscribe({
        next: () => {
          alert('Doctor created');

          this.router.navigate(['/manage-doctors']);
        },

        error: (err) => {
          console.log(err);

          alert('Creation failed');
        },
      });
    }
  }

  loadDoctorById() {
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (res: any) => {
        this.doctor = {
          name: res.name,

          email: res.email,

          phone: res.phone,

          password: '',

          departmentId: res.department?.id,

          categoryId: res.category?.id,
        };
      },

      error: (err) => {
        console.log(err);
      },
    });
  }
}
