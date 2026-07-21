import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/']);
    }

    const allowedRoles: string[] = route.data['roles'];
    const actualRole = this.authService.getRole();

    if (actualRole && allowedRoles.includes(actualRole)) {
      return true;
    }

    // Prevent the user from opening another module manually.
    if (actualRole === 'admin') {
      return this.router.createUrlTree(['/admin-dashboard']);
    }

    if (actualRole === 'receptionist') {
      return this.router.createUrlTree(['/receptionist-dashboard']);
    }

    if (actualRole === 'doctor') {
      return this.router.createUrlTree(['/doctor-dashboard']);
    }

    if (actualRole === 'super_admin') {
      return this.router.createUrlTree(['/super-admin-dashboard']);
    }

    return this.router.createUrlTree(['/']);
  }
}
