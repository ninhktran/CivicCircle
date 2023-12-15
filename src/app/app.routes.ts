import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthenticatedOnlyGuard } from './services/authenticated.only.guard';
import { UnauthenticatedOnlyGuard } from './services/unauthenticated.only.guard';

/**
 * Routes configuration for the Angular application.
 * Defines the routing paths, associated components, and guards for route protection.
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        // Lazy loads EventComponent for the default and 'events' path
        loadComponent: () => import('./event/event.component').then(m => m.EventComponent),
      },
      {
        path: 'events',
        loadComponent: () => import('./event/event.component').then(m => m.EventComponent),
      },
      {
        path: 'interested',
        loadComponent: () => import('./event/event.component').then(m => m.EventComponent),
        canActivate: [AuthenticatedOnlyGuard]
      },
      {
        // Routes for 'login', 'register', and 'forgot-password' are protected by UnauthenticatedOnlyGuard
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
        canActivate: [UnauthenticatedOnlyGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
        canActivate: [UnauthenticatedOnlyGuard]
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        canActivate: [UnauthenticatedOnlyGuard]
      },
      {
        // Redirects any unknown paths to the default path
        path: '**',
        redirectTo: ''
      }
    ]
  }
];
