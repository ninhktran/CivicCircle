import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  getAdditionalUserInfo,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, filter, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterDto } from '../models/RegisterDto';

/**
 * Injectable authentication service to handle user registration, login, logout,
 * and other auth-related functionality.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  public authState = new BehaviorSubject<User | null | undefined>(undefined);
  private currentUserSubject: BehaviorSubject<string | null>;

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    // Listen to authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.authState.next(user);
    });

    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<string | null>(storedUser);
  }

  /**
   * Observable to check if the user is logged in.
   */
  get isLoggedIn$(): Observable<boolean> {
    return this.authState.asObservable().pipe(
      filter(value => value !== undefined),
      map(user => !!user)
    );
  }

  /**
   * Retrieves the current user's authentication token.
   * @returns A promise that resolves to the token or null if not authenticated.
   */
  getCurrentUserToken(): Promise<string | null> {
    const user = this.authState.value;
    if (user) {
      return user.getIdToken();
    } else {
      return Promise.resolve(null);
    }
  }

  /**
   * Getter for the current user.
   */
  get currentUser(): User {
    return this.authState.value!;
  }

  /**
   * Observable of the current user's email.
   */
  get currentUser$() {
    return this.currentUserSubject.asObservable();
  }

  /**
   * Signs up a user with email and password.
   * @param user User data for registration.
   * @returns A promise that resolves to the User object.
   */
  signupUser(user: RegisterDto): Promise<User> {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then((result) => {
        this.router.navigate(['/home']);
        sendEmailVerification(result.user);
        return result.user;
      })
      .catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
        throw error;
      });
  }

  /**
   * Logs in a user with email and password.
   * @param user User credentials for login.
   * @returns A promise resolved after successful login.
   */
  loginUser(user: RegisterDto): Promise<any> {
    return signInWithEmailAndPassword(this.auth, user.email, user.password)
      .then((credential) => {
        this.currentUserSubject.next(user.email);
        localStorage.setItem('currentUser', user.email);
        console.log('Logged in user UID:', credential.user.uid);
        this.router.navigate(['/home']);
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
        throw error;
      });
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    signOut(this.auth).then(() => {
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      this.router.navigate(['/']);
    });
  }

  /**
   * Deletes the account of the currently logged-in user.
   */
  deleteAccount(): void {
    deleteUser(this.auth.currentUser!).then(() => {
      this.router.navigate(['/']);
    });
  }

  /**
   * Authenticates the user using Google.
   */
  googleAuth() {
    return this.loginWithPopup(new GoogleAuthProvider());
  }

  /**
   * Authenticates the user using Microsoft.
   */
  microsoftAuth() {
    return this.loginWithPopup(new OAuthProvider('microsoft.com'));
  }

  /**
   * Handles login with a popup for third-party providers.
   * @param provider The authentication provider.
   */
  loginWithPopup(provider: any) {
    return signInWithPopup(this.auth, provider).then((result) => {
      console.log('Logged in user UID:', result.user.uid);
      this.router.navigate(['/home']);
    }).catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
      throw error;
    });
  }

  /**
   * Sends a password reset email to the given email.
   * @param email The email address to send the password reset email to.
   */
  sendPasswordResetEmail(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.router.navigate(['/']);
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
        throw error;
      });
  }
}
