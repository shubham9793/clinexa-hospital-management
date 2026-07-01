import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { getErrorMessage } from 'src/app/shared/utils/error-message.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-forgot-password',
  templateUrl: './verify-forgot-password.component.html',
  styleUrls: ['./verify-forgot-password.component.scss'],
})
export class VerifyForgotPasswordComponent implements OnInit, OnDestroy {
  email = '';
  otp = '';

  isVerifying = false;
  isResending = false;

  resendSeconds = 30;
  private timer: any;

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
        title: 'Email Missing',
        text: 'Please enter your email again.',
        confirmButtonColor: '#0891b2',
      }).then(() => {
        this.router.navigate(['/forgot-password']);
      });
      return;
    }

    this.startResendTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  verifyOtp(): void {
    if (!this.otp || this.otp.trim().length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'Please enter the 6-digit OTP sent to your email.',
        confirmButtonColor: '#0891b2',
      });
      return;
    }

    this.isVerifying = true;

    this.authService
      .verifyForgotPasswordOtp({
        email: this.email,
        otp: this.otp.trim(),
      })
      .subscribe({
        next: () => {
          this.isVerifying = false;

          Swal.fire({
            icon: 'success',
            title: 'OTP Verified',
            text: 'You can now reset your password.',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/reset-password'], {
              queryParams: { email: this.email },
            });
          });
        },
        error: (err) => {
          this.isVerifying = false;

          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: getErrorMessage(err),
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  resendOtp(): void {
    if (this.resendSeconds > 0 || this.isResending) {
      return;
    }

    this.isResending = true;

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.isResending = false;
        this.resendSeconds = 30;
        this.startResendTimer();

        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: 'A new OTP has been sent to your email.',
          timer: 1400,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.isResending = false;

        Swal.fire({
          icon: 'error',
          title: 'Resend Failed',
          text: getErrorMessage(err),
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }

  private startResendTimer(): void {
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      if (this.resendSeconds > 0) {
        this.resendSeconds--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}
