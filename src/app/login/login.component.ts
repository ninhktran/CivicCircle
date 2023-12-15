import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RegisterDto } from '../models/RegisterDto';
import { AuthService } from '../services/auth.service';

/**
 * Component for user login.
 * Provides a form for users to enter their email and password to log into the application.
 */
@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    InputTextModule,
    FormsModule,
    CheckboxModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginComponent implements OnInit {
  // FormGroup instance to manage the login form
  form!: FormGroup;

  /**
   * Constructor for LoginComponent.
   * @param formBuilder FormBuilder service to create reactive forms.
   * @param authService AuthService to handle user authentication.
   */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  /**
   * OnInit lifecycle hook to initialize the form.
   * Sets up the form with required validations for email and password fields.
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Handles the submission of the login form.
   * If the form is valid, calls the authService to perform the login.
   */
  loginUser() {
    if (!this.form.invalid) {
      const loginUser: RegisterDto = { ...this.form.value };

      // Call the authService to handle user login
      this.authService.loginUser(loginUser);
    }
  }
}
