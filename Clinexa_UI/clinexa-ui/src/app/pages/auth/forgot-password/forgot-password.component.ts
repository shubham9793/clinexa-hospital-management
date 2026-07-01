import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { getErrorMessage } from 'src/app/shared/utils/error-message.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  sendOtp(): void {
    if (!this.email.trim()) {
      this.showWarning('Email is required.');
      return;
    }

    if (!this.isValidEmail(this.email.trim())) {
      this.showWarning('Please enter a valid email address.');
      return;
    }

    const email = this.email.trim().toLowerCase();

    this.isSubmitting = true;

    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: 'Password reset OTP has been sent to your email.',
          timer: 1600,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/verify-forgot-password'], {
            queryParams: { email },
          });
        });
      },
      error: (err) => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to Send OTP',
          text: getErrorMessage(err),
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: message,
      confirmButtonColor: '#0891b2',
    });
  }
}
