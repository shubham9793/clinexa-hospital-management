import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    /*
     * Do not attach an old token during login
     * or Patient registration.
     */
    const isPublicAuthRequest =
      req.url.includes('/auth/login') || req.url.includes('/auth/register');

    if (isPublicAuthRequest) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
    }

    const token = localStorage.getItem('token');

    let requestToSend = req;

    if (token) {
      requestToSend = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(requestToSend).pipe(
      catchError((error: HttpErrorResponse) => {
        /*
         * Invalid or expired token:
         * clear session and return to home page.
         */
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('user');

          this.router.navigate(['/']);
        }

        /*
         * A 403 means the user is logged in,
         * but their role is not allowed to use
         * the requested API.
         *
         * Do not automatically log out on 403.
         */
        if (error.status === 403) {
          console.error('Access denied for this request:', req.url);
        }

        return throwError(() => error);
      }),
    );
  }
}
