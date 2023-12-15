import { Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { ProfileUser } from '../models/UserProfile';
import { Observable, from, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Service to handle Firestore database operations related to user profiles.
 * Provides methods for adding, updating, and retrieving user profile data.
 */
@Injectable({
  providedIn: 'root'
})
export class UserDatabaseService {

  /**
   * Constructor for UserDatabaseService.
   * @param fs Firestore instance for database operations.
   * @param authService Service to handle authentication-related operations.
   */
  constructor(private fs: Firestore, private authService: AuthService) { }

  /**
   * Adds a new user profile to the Firestore database.
   * @param user The user profile data to add.
   * @returns An Observable that completes when the operation is done.
   */
  addUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.fs, 'users/' + user?.uid);
    return from(setDoc(ref, user));
  }

  /**
   * Updates an existing user profile in the Firestore database.
   * @param user The updated user profile data.
   * @returns An Observable that completes when the operation is done.
   */
  updateUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.fs, 'users/' + user?.uid);
    return from(updateDoc(ref, { ...user }));
  }

  /**
   * Observable of the current user's profile data.
   * Retrieves the profile data of the currently authenticated user from Firestore.
   * @returns An Observable of the user's profile data, or null if not authenticated.
   */
  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.authState.pipe(
      switchMap(user => {
        if (user) {
          const ref = doc(this.fs, 'users/' + user.uid);
          return docData(ref) as Observable<ProfileUser>;
        } else {
          return of(null);
        }
      })
    );
  }
}
