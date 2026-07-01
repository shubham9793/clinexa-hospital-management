import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { getErrorMessage } from 'src/app/shared/utils/error-message.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  gender = '';
  dob = '';
  address = '';

  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(): void {
    if (!this.isFormValid()) {
      return;
    }

    const data = {
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      phone: this.phone.trim(),
      password: this.password,
      gender: this.gender,
      dob: this.dob,
      address: this.address.trim(),
    };

    this.isSubmitting = true;

    this.authService.registerPatient(data).subscribe({
      next: () => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Please login to continue.',
          timer: 1600,
          showConfirmButton: false,
        });

        this.router.navigate(['/login/patient']);
      },
      error: (err) => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: getErrorMessage(err),
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  private isFormValid(): boolean {
    if (!this.name.trim()) {
      this.showValidationError('Full name is required.');
      return false;
    }

    if (!this.email.trim()) {
      this.showValidationError('Email is required.');
      return false;
    }

    if (!this.phone.trim()) {
      this.showValidationError('Phone number is required.');
      return false;
    }

    if (!this.gender) {
      this.showValidationError('Please select gender.');
      return false;
    }

    if (!this.dob) {
      this.showValidationError('Date of birth is required.');
      return false;
    }

    if (!this.password) {
      this.showValidationError('Password is required.');
      return false;
    }

    if (!this.confirmPassword) {
      this.showValidationError('Confirm password is required.');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.showValidationError('Passwords do not match.');
      return false;
    }

    if (this.password.length < 6) {
      this.showValidationError('Password must contain at least 6 characters.');
      return false;
    }

    return true;
  }

  private showValidationError(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Empty Field',
      text: message,
      confirmButtonColor: '#0891b2',
    });
  }
}
