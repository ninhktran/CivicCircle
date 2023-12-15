import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Component for the authentication landing page.
 * This component provides options for authentication using different providers
 * such as Microsoft, Google, or email.
 */
@Component({
  selector: 'app-aut-landing',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule
  ],
  templateUrl: './aut-landing.component.html',
  styleUrls: ['./aut-landing.component.css'],
})
export class AutLandingComponent {

  /**
   * Constructor for AutLandingComponent.
   * @param authService Service for handling authentication operations.
   * @param dialogRef Reference to the dialog opened as this modal.
   */
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<AutLandingComponent>
  ) { }

  /**
   * Initiates the Microsoft authentication process and closes the dialog.
   */
  microsoftAuth() {
    this.authService.microsoftAuth();
    this.dialogRef.close();
  }

  /**
   * Initiates the Google authentication process and closes the dialog.
   */
  googleAuth() {
    this.authService.googleAuth();
    this.dialogRef.close();
  }

  /**
   * Placeholder for email authentication. Currently, it just closes the dialog.
   */
  emailAuth() {
    this.dialogRef.close();
  }
}
