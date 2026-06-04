import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/service/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
      },

      error: () => {
        localStorage.removeItem('token');

        this.router.navigate(['/']);
      },
    });
  }

  logout() {
    localStorage.removeItem('token');

    this.router.navigate(['/']);
  }
}
