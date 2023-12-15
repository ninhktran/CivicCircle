import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Injectable HTTP Interceptor class for globally handling HTTP errors.
 * Catches any HTTP errors and displays error messages using PrimeNG's MessageService.
 */
@Injectable()
export class GlobalErrorInterceptor implements HttpInterceptor {
  /**
   * Constructor for GlobalErrorInterceptor.
   * @param messageService Service for displaying messages to the user.
   */
  constructor(private messageService: MessageService) { }

  /**
   * Intercepts HTTP requests and adds error handling.
   * @param req The outgoing HttpRequest to be intercepted.
   * @param next The next interceptor in the chain or the backend if no more interceptors are left.
   * @returns Observable<HttpEvent<any>> The HTTP event stream with error handling logic.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check if the error is an instance of HttpErrorResponse and display a message
        if (error instanceof HttpErrorResponse) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
        }

        // Propagate the error
        return throwError(() => error);
      })
    );
  }
}
