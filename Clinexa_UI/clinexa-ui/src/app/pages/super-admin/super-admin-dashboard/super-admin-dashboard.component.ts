import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { SuperAdminService } from 'src/app/service/super-admin.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss'],
})
export class SuperAdminDashboardComponent implements OnInit {
  totalAdmins = 0;
  activeAdmins = 0;
  inactiveAdmins = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private superAdminService: SuperAdminService,
  ) {}

  ngOnInit(): void {
    this.loadAdminStats();
  }

  loadAdminStats(): void {
    this.superAdminService.getAdmins().subscribe({
      next: (admins) => {
        this.totalAdmins = admins.length;

        this.activeAdmins = admins.filter((admin) => admin.enabled).length;

        this.inactiveAdmins = admins.filter((admin) => !admin.enabled).length;
      },

      error: (err) => {
        console.error('Failed to load admin stats', err);
      },
    });
  }

  goToManageAdmins(): void {
    this.router.navigate(['/manage-admins']);
  }

  goToAddAdmin(): void {
    this.router.navigate(['/add-admin']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
