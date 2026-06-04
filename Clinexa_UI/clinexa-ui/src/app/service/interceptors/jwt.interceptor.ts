import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
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
    const token = localStorage.getItem('token');

    let clonedRequest = req;

    if (token) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next
      .handle(clonedRequest)

      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            localStorage.clear();

            this.router.navigate(['/login']);
          }

          return throwError(() => error);
        }),
      );
  }
}
