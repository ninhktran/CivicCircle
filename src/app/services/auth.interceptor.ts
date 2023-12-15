import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Injectable HTTP Interceptor class.
 * Intercepts outgoing HTTP requests and attaches an authorization token, if available.
 * This ensures that requests requiring authentication have the necessary token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Constructor for the AuthInterceptor.
   * @param authService Service to handle authentication-related operations.
   */
  constructor(public authService: AuthService) {
  }

  /**
   * Intercepts an outgoing HttpRequest and modifies it.
   * If the user is authenticated, it attaches the authorization token to the request headers.
   * @param request The outgoing HttpRequest to be intercepted.
   * @param next The next interceptor in the chain or the backend if no more interceptors are left.
   * @returns Observable<HttpEvent<any>> The HTTP event stream.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the current user token
    return from(this.authService.getCurrentUserToken()).pipe(
      switchMap(token => {
        if (token) {
          // If token exists, clone the request and set the authorization header
          const authReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(authReq);
        }
        // If no token, forward the request unmodified
        return next.handle(request);
      })
    );
  }
}
