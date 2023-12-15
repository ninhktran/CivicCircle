import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LayoutComponent } from './layout/layout.component';

/**
 * Root component of the application.
 * It acts as the main container for the application, including routing and layout management.
 * The ToastModule from PrimeNG is used for displaying notifications.
 */
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,   // Allows for routing to different components.
    LayoutComponent, // Main layout component of the application.
    ToastModule      // Module from PrimeNG for displaying toasts (notifications).
  ]
})
export class AppComponent {
  // The logic for the root component can be added here.
}
