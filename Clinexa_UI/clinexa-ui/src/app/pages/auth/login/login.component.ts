import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  // Role selected from the login page URL.
  // This is used only to check whether the user selected the correct portal.
  selectedRole: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.selectedRole = this.route.snapshot.params['role'];
  }

  login(): void {
    const data = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(data).subscribe({
      next: (res: any) => {
        const actualRole = res.role?.toLowerCase();

        if (!res.token || !actualRole) {
          alert('Role information was not returned by the server');
          return;
        }

        // Prevent login through the wrong portal.
        if (actualRole !== this.selectedRole) {
          alert(
            `Access denied. This account belongs to the ${actualRole} module.`,
          );
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', actualRole);

        alert('Login successful');

        this.redirectToDashboard(actualRole);
      },

      error: () => {
        alert('Invalid credentials');
      },
    });
  }

  private redirectToDashboard(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'receptionist') {
      this.router.navigate(['/receptionist-dashboard']);
    } else if (role === 'doctor') {
      this.router.navigate(['/doctor-dashboard']);
    } else if (role === 'super-admin') {
      this.router.navigate(['/super-admin-dashboard']);
    } else if (role === 'patient') {
    this.router.navigate(['/patient-dashboard']);
    }else {
      this.authService.logout();
    }
  }
}
