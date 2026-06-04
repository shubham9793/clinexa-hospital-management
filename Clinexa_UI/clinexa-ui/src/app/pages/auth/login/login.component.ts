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

  role :string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.role = this.route.snapshot.params['role'];
  }

  login() {
    const data = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(data).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);

        alert('Login successful');

        if (this.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }



      },

      error: () => {
        alert('Invalid credentials');
      },
    });
  }
}
