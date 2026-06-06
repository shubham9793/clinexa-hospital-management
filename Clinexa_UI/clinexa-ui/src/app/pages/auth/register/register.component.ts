import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

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
    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.password ||
      !this.confirmPassword ||
      !this.gender ||
      !this.dob
    ) {
      alert('Please complete all required fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      alert('Password must contain at least 6 characters');
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

        alert('Registration successful. Please log in.');

        this.router.navigate(['/login/patient']);
      },

      error: (err) => {
        this.isSubmitting = false;

        const message =
          err.error?.message || err.error || 'Registration failed';

        alert(message);
      },
    });
  }
}
