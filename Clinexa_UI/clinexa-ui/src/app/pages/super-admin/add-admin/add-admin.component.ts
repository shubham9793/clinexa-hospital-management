import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { SuperAdminService } from 'src/app/service/super-admin.service';
import { getErrorMessage } from 'src/app/shared/utils/error-message.util';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private superAdminService: SuperAdminService,
    private router: Router,
  ) {}

  createAdmin(): void {
    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.password.trim() ||
      !this.confirmPassword.trim()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing details',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#0891b2',
      });

      return;
    }

    if (!this.isValidEmail(this.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#0891b2',
      });

      return;
    }

    if (!this.isValidPhone(this.phone)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid phone number',
        text: 'Please enter a valid 10-digit phone number.',
        confirmButtonColor: '#0891b2',
      });

      return;
    }

    if (this.password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak password',
        text: 'Password must contain at least 6 characters.',
        confirmButtonColor: '#0891b2',
      });

      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password mismatch',
        text: 'Password and confirm password do not match.',
        confirmButtonColor: '#0891b2',
      });

      return;
    }

    const request = {
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      phone: this.phone.trim(),
      password: this.password,
    };

    this.isLoading = true;

    this.superAdminService.createAdmin(request).subscribe({
      next: (response) => {
        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: 'Admin Created',
          text: response || 'Admin created successfully.',
          confirmButtonColor: '#0891b2',
        }).then(() => {
          this.router.navigate(['/manage-admins']);
        });
      },

      error: (err) => {
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to create admin',
          text: getErrorMessage(err),
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/manage-admins']);
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email.trim());
  }

  private isValidPhone(phone: string): boolean {
    return /^[0-9]{10}$/.test(phone.trim());
  }
}
