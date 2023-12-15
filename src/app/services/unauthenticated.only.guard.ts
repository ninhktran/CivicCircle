import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * A route guard service that restricts navigation to certain routes only for unauthenticated users.
 * Redirects authenticated users to the home page.
 */
@Injectable({
  providedIn: 'root'
})
export class UnauthenticatedOnlyGuard {

  /**
   * Constructor for UnauthenticatedOnlyGuard.
   * @param authService Service to check the authentication status of the user.
   * @param router Router to navigate to different routes.
   */
  constructor(private authService: AuthService, public router: Router) { }

  /**
   * Determines if a route can be activated based on the user's authentication status.
   * Redirects to the home page if the user is authenticated.
   * @returns Observable<boolean> | Promise<boolean> | boolean Whether the route can be activated by unauthenticated users.
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      map(isLoggedIn => {
        if (isLoggedIn) {
          // Redirect to home if the user is logged in
          this.router.navigate(['/home']);
          return false;
        }
        // Allow access if the user is not logged in
        return true;
      })
    );
  }
}
