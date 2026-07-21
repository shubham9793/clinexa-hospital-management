// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private baseUrl = 'http://localhost:8081/auth';

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//   ) {}

//   login(data: any) {
//     return this.http.post(`${this.baseUrl}/login`, data);
//   }

//   getProfile() {
//     return this.http.get('http://localhost:8081/user/profile');
//   }

//   getRole(): string | null {
//     return localStorage.getItem('role');
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token');
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('user');

//     // Your routing file does not contain a plain "/login" route.
//     // Therefore, send the user back to the home page.
//     this.router.navigate(['/']);
//   }

//   redirectToCorrectDashboard(): void {
//     const role = this.getRole();

//     if (role === 'admin') {
//       this.router.navigate(['/admin-dashboard']);
//     } else if (role === 'receptionist') {
//       this.router.navigate(['/receptionist-dashboard']);
//     } else if (role === 'doctor') {
//       this.router.navigate(['/doctor-dashboard']);
//     } else if (role === 'super-admin') {
//       this.router.navigate(['/super-admin-dashboard']);
//     } else {
//       this.logout();
//     }
//   }

//   registerPatient(data: any) {
//     return this.http.post(`${this.baseUrl}/register/patient`, data, {
//       responseType: 'text',
//     });
//   }

//   verifyEmailOtp(data: { email: string; otp: string }) {
//     return this.http.post(`${this.baseUrl}/verify-email-otp`, data, {
//       responseType: 'text',
//     });
//   }

//   resendEmailOtp(data: { email: string }) {
//     return this.http.post(`${this.baseUrl}/resend-email-otp`, data, {
//       responseType: 'text',
//     });
//   }

//   forgotPassword(data: { email: string }) {
//     return this.http.post(`${this.baseUrl}/forgot-password`, data, {
//       responseType: 'text',
//     });
//   }

//   verifyForgotPasswordOtp(data: { email: string; otp: string }) {
//     return this.http.post(
//       `${this.baseUrl}/verify-forgot-password-otp`,
//       data,
//       {
//         responseType: 'text',
//       },
//     );
//   }

//   resetPassword(data: { email: string; newPassword: string }) {
//     return this.http.put(`${this.baseUrl}/reset-password`, data, {
//       responseType: 'text',
//     });
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  getProfile() {
    return this.http.get(`${environment.apiUrl}/user/profile`);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    // Your routing file does not contain a plain "/login" route.
    // Therefore, send the user back to the home page.
    this.router.navigate(['/']);
  }

  redirectToCorrectDashboard(): void {
    const role = this.getRole();

    if (role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'receptionist') {
      this.router.navigate(['/receptionist-dashboard']);
    } else if (role === 'doctor') {
      this.router.navigate(['/doctor-dashboard']);
    } else if (role === 'super_admin') {
      this.router.navigate(['/super-admin-dashboard']);
    } else {
      this.logout();
    }
  }

  registerPatient(data: any) {
    return this.http.post(`${this.baseUrl}/register/patient`, data, {
      responseType: 'text',
    });
  }

  verifyEmailOtp(data: { email: string; otp: string }) {
    return this.http.post(`${this.baseUrl}/verify-email-otp`, data, {
      responseType: 'text',
    });
  }

  resendEmailOtp(data: { email: string }) {
    return this.http.post(`${this.baseUrl}/resend-email-otp`, data, {
      responseType: 'text',
    });
  }

  forgotPassword(data: { email: string }) {
    return this.http.post(`${this.baseUrl}/forgot-password`, data, {
      responseType: 'text',
    });
  }

  verifyForgotPasswordOtp(data: { email: string; otp: string }) {
    return this.http.post(`${this.baseUrl}/verify-forgot-password-otp`, data, {
      responseType: 'text',
    });
  }

  resetPassword(data: { email: string; newPassword: string }) {
    return this.http.put(`${this.baseUrl}/reset-password`, data, {
      responseType: 'text',
    });
  }
}
