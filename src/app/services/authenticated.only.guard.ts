import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * A route guard service that allows navigation only if the user is authenticated.
 * It checks the user's authentication status and redirects to the home page if not authenticated.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticatedOnlyGuard {

  /**
   * Constructor for AuthenticatedOnlyGuard.
   * @param authService Service to check the authentication status of the user.
   * @param router Router to navigate to different routes.
   */
  constructor(private authService: AuthService, public router: Router) { }

  /**
   * Determines if a route can be activated based on the user's authentication status.
   * Redirects to the home page if the user is not authenticated.
   * @returns Observable<boolean> | Promise<boolean> | boolean Whether the route can be activated.
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}
