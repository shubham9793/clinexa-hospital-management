import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: any = null;

  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        this.isLoading = false;
      },

      error: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please login again.',
          confirmButtonColor: '#0891b2',
        }).then(() => {
          localStorage.clear();
          this.router.navigate(['/']);
        });
      },
    });
  }

  logout(): void {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();

        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully.',
          timer: 1500,
          showConfirmButton: false,
        });

        this.router.navigate(['/']);
      }
    });
  }
}
