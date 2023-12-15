import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RegisterDto } from '../models/RegisterDto';
import { AuthService } from '../services/auth.service';
import { UserDatabaseService } from '../services/user-database.service';
import { switchMap } from 'rxjs';

/**
 * Component for user registration.
 * Provides a form for users to enter their email and password to register for the application.
 */
@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    InputTextModule,
    FormsModule,
    CheckboxModule,
    ButtonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class RegisterComponent implements OnInit {
  // FormGroup instance to manage the registration form
  form!: FormGroup;

  /**
   * Constructor for RegisterComponent.
   * @param formBuilder FormBuilder service to create reactive forms.
   * @param authService AuthService to handle user authentication and registration.
   * @param userdb UserDatabaseService to interact with the user database.
   */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userdb: UserDatabaseService,
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
   * Handles the submission of the registration form.
   * If the form is valid, registers the user using authService and adds user data to the user database.
   */
  createUser() {
    if (!this.form.invalid) {
      const newUser: RegisterDto = { ...this.form.value };

      // Register the user and then add their details to the user database
      this.authService.signupUser(newUser).then(user => {
        this.userdb.addUser({ uid: user.uid, email: newUser.email, interestedEvents: [] });
      });
    }
  }
}
