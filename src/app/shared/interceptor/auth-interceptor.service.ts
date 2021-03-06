import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private spinnerService: SpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    !req.headers.get('hideLoader') && this.spinnerService.showSpinner();
    const token: string | null = localStorage.getItem('token');
    let request = req;

    if (req.headers.get('Anonymous') === null && token) {
      request = req.clone({
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          authorization: `Bearer ${token}`,
        },
      });
    } else {
      request = req.clone({
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });
    }

    request.headers.delete('hideLoader')
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) this.spinnerService.hideSpinner();
        this.router.navigateByUrl('/auth/login');
        return throwError(err);
      }),
      finalize(() => this.spinnerService.hideSpinner())
    );
  }
}
