import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  selectedRole = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.selectedRole = this.route.snapshot.params['role'];
  }

  login(): void {
    if (!this.email.trim() || !this.password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing details',
        text: 'Please enter your email and password.',
        confirmButtonColor: '#0891b2',
      });
      return;
    }

    const data = {
      email: this.email.trim().toLowerCase(),
      password: this.password,
    };

    this.isLoading = true;

    this.authService.login(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const actualRole = res.role?.toLowerCase();

        if (!res.token || !actualRole) {
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'Role information was not returned by the server.',
            confirmButtonColor: '#0891b2',
          });
          return;
        }

        if (actualRole !== this.selectedRole) {
          Swal.fire({
            icon: 'error',
            title: 'Access denied',
            text: `This account belongs to the ${actualRole} module. Please use the correct portal.`,
            confirmButtonColor: '#0891b2',
          });
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', actualRole);

        Swal.fire({
          icon: 'success',
          title: 'Welcome back!',
          text: 'Login successful. Redirecting to your dashboard...',
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          this.redirectToDashboard(actualRole);
        });
      },

      error: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Invalid credentials',
          text: 'Please check your email and password.',
          confirmButtonColor: '#0891b2',
        });
      },
    });
  }

  get portalTitle(): string {
    if (this.selectedRole === 'admin') return 'Admin Portal';
    if (this.selectedRole === 'receptionist') return 'Receptionist Portal';
    if (this.selectedRole === 'doctor') return 'Doctor Portal';
    if (this.selectedRole === 'patient') return 'Patient Portal';
    return 'Clinexa Portal';
  }

  get portalIcon(): string {
    if (this.selectedRole === 'admin') return '🛡️';
    if (this.selectedRole === 'receptionist') return '👩‍💼';
    if (this.selectedRole === 'doctor') return '👨‍⚕️';
    if (this.selectedRole === 'patient') return '👤';
    return '🏥';
  }

  private redirectToDashboard(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'receptionist') {
      this.router.navigate(['/receptionist-dashboard']);
    } else if (role === 'doctor') {
      this.router.navigate(['/doctor-dashboard']);
    } else if (role === 'patient') {
      this.router.navigate(['/patient-dashboard']);
    } else if (role === 'super-admin') {
      this.router.navigate(['/super-admin-dashboard']);
    } else {
      this.authService.logout();
    }
  }
}
