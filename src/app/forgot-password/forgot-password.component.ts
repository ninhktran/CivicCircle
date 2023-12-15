import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';

/**
 * Component for the forgot password functionality.
 * Allows users to reset their password by providing their email.
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  // Form group for the forgot password form
  form!: FormGroup;

  /**
   * Constructor for the ForgotPasswordComponent.
   * @param formBuilder FormBuilder to create the reactive form.
   * @param authService Service for handling authentication related operations.
   */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  /**
   * OnInit lifecycle hook to initialize the form.
   * Sets up the form with necessary validations.
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required] // Email field with required validation
    });
  }

  /**
   * Sends a password reset email to the provided email address.
   * Only triggers if the form is valid.
   */
  sendPasswordResetEmail() {
    if (!this.form.invalid) {
      const email = this.form.value.email;
      this.authService.sendPasswordResetEmail(email);
    }
  }
}
