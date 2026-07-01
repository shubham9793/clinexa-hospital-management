import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';
import { getErrorMessage } from 'src/app/shared/utils/error-message.util';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  email = '';

  newPassword = '';
  confirmPassword = '';

  hidePassword = true;
  hideConfirmPassword = true;

  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    if (!this.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Request',
        text: 'Please restart the forgot password process.',
        confirmButtonColor: '#0891b2',
      }).then(() => {
        this.router.navigate(['/forgot-password']);
      });
    }
  }

  updatePassword(): void {
    if (!this.newPassword.trim()) {
      this.showWarning('New password is required.');
      return;
    }

    if (this.newPassword.length < 6) {
      this.showWarning('Password must contain at least 6 characters.');
      return;
    }

    if (!this.confirmPassword.trim()) {
      this.showWarning('Confirm password is required.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showWarning('Passwords do not match.');
      return;
    }

    this.isSubmitting = true;

    this.authService
      .resetPassword({
        email: this.email,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          Swal.fire({
            icon: 'success',
            title: 'Password Updated',
            text: 'Your password has been updated successfully.',
            timer: 1700,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/login/patient']);
          });
        },

        error: (err) => {
          this.isSubmitting = false;

          Swal.fire({
            icon: 'error',
            title: 'Unable to Update Password',
            text: getErrorMessage(err),
            confirmButtonColor: '#0891b2',
          });
        },
      });
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
