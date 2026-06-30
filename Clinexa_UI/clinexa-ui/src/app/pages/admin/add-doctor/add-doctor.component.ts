import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoryService } from 'src/app/service/category.service';
import { DepartmentService } from 'src/app/service/department.service';
import { DoctorService } from 'src/app/service/doctor.service';

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
    active: true,
    departmentId: '',
    categoryId: '',
    password: '',
  };

  departments: any[] = [];
  categories: any[] = [];

  doctorId: number | null = null;
  isEditMode = false;
  isSubmitting = false;

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

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.doctorId = Number(id);
      this.isEditMode = true;
      this.loadDoctorById();
    }
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res;
      },
      error: () => {
        this.departments = [];
        this.showError('Unable to load departments');
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res: any) => {
        this.categories = res;
      },
      error: () => {
        this.categories = [];
        this.showError('Unable to load categories');
      },
    });
  }

  loadDoctorById(): void {
    if (!this.doctorId) {
      return;
    }

    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (res: any) => {
        this.doctor = {
          name: res.name || '',
          email: res.email || '',
          phone: res.phone || '',
          active: res.active ?? true,
          departmentId: res.department?.id || '',
          categoryId: res.category?.id || '',
          password: '',
        };
      },
      error: () => {
        this.showError('Unable to load doctor details');
      },
    });
  }

  createDoctor(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    const payload: any = {
      name: this.doctor.name.trim(),
      email: this.doctor.email.trim().toLowerCase(),
      phone: this.doctor.phone.trim(),
      active: this.doctor.active,
      departmentId: Number(this.doctor.departmentId),
      categoryId: Number(this.doctor.categoryId),
      password: this.doctor.password,
    };

    if (this.isEditMode && !payload.password) {
      delete payload.password;
    }

    if (this.isEditMode) {
      this.updateDoctor(payload);
    } else {
      this.saveDoctor(payload);
    }
  }

  saveDoctor(payload: any): void {
    this.doctorService.createDoctor(payload).subscribe({
      next: () => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: 'Doctor Created',
          text: 'Doctor profile and login account were created successfully.',
          confirmButtonColor: '#0891b2',
        }).then(() => {
          this.router.navigate(['/manage-doctors']);
        });
      },
      error: (err) => {
        this.isSubmitting = false;

        this.showError(
          err?.error?.message || err?.error || 'Doctor creation failed',
        );
      },
    });
  }

  updateDoctor(payload: any): void {
    if (!this.doctorId) {
      this.isSubmitting = false;
      return;
    }

    this.doctorService.updateDoctor(this.doctorId, payload).subscribe({
      next: () => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: 'Doctor Updated',
          text: 'Doctor profile and login details were updated successfully.',
          confirmButtonColor: '#0891b2',
        }).then(() => {
          this.router.navigate(['/manage-doctors']);
        });
      },
      error: (err) => {
        this.isSubmitting = false;

        this.showError(
          err?.error?.message || err?.error || 'Doctor update failed',
        );
      },
    });
  }

  validateForm(): boolean {
    if (!this.doctor.name.trim()) {
      this.showWarning('Doctor name is required');
      return false;
    }

    if (!this.doctor.email.trim()) {
      this.showWarning('Doctor email is required');
      return false;
    }

    if (!this.isValidEmail(this.doctor.email)) {
      this.showWarning('Please enter a valid email address');
      return false;
    }

    if (!this.doctor.phone.trim()) {
      this.showWarning('Doctor phone number is required');
      return false;
    }

    if (!this.doctor.departmentId) {
      this.showWarning('Please select a department');
      return false;
    }

    if (!this.doctor.categoryId) {
      this.showWarning('Please select a category');
      return false;
    }

    if (!this.isEditMode && !this.doctor.password) {
      this.showWarning('Doctor login password is required');
      return false;
    }

    if (this.doctor.password && this.doctor.password.length < 6) {
      this.showWarning('Password must contain at least 6 characters');
      return false;
    }

    return true;
  }

  goBack(): void {
    this.router.navigate(['/manage-doctors']);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Required Information',
      text: message,
      confirmButtonColor: '#0891b2',
    });
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong',
      text: message,
      confirmButtonColor: '#0891b2',
    });
  }
}
