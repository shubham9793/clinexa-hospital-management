import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from 'src/app/service/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent implements OnInit {
  departmentId!: number;

  isEditMode = false;

  isSubmitting = false;

  department = {
    name: '',
    description: '',
  };

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.departmentId = Number(id);

      this.loadDepartment();
    }
  }

  loadDepartment(): void {
    this.departmentService.getById(this.departmentId).subscribe({
      next: (res: any) => {
        this.department = {
          name: res.name || '',
          description: res.description || '',
        };
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Unable to load department details',
        });
      },
    });
  }

  createDepartment(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    const payload = {
      name: this.department.name.trim(),
      description: this.department.description.trim(),
    };

    if (this.isEditMode) {
      this.updateDepartment(payload);
    } else {
      this.saveDepartment(payload);
    }
  }

  saveDepartment(payload: any): void {
    this.departmentService.create(payload).subscribe({
      next: () => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: 'Department Created',
          text: 'Department created successfully.',
          timer: 1800,
          showConfirmButton: false,
        });

        this.router.navigate(['/manage-departments']);
      },

      error: (err) => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: err?.error?.message || 'Unable to create department.',
        });
      },
    });
  }

  updateDepartment(payload: any): void {
    this.departmentService
      .updateDepartment(this.departmentId, payload)
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          Swal.fire({
            icon: 'success',
            title: 'Department Updated',
            text: 'Department updated successfully.',
            timer: 1800,
            showConfirmButton: false,
          });

          this.router.navigate(['/manage-departments']);
        },

        error: (err) => {
          this.isSubmitting = false;

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: err?.error?.message || 'Unable to update department.',
          });
        },
      });
  }

  validateForm(): boolean {
    if (!this.department.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Department Name Required',
        text: 'Please enter department name.',
      });
      return false;
    }

    if (this.department.name.trim().length < 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Name',
        text: 'Department name must contain at least 3 characters.',
      });
      return false;
    }

    if (!this.department.description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Description Required',
        text: 'Please enter department description.',
      });
      return false;
    }

    if (this.department.description.trim().length < 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Description Too Short',
        text: 'Please provide meaningful description.',
      });
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/manage-departments']);
  }
}
