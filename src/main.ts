/// <reference types="@angular/localize" />

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { GlobalErrorInterceptor } from './app/services/global.error.interceptor';
import { environment } from './environments/environment';
import { Timestamp, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

/**
 * Bootstraps the Angular application with specific configurations and services.
 * Sets up routing, Firebase services, HTTP client with interceptors, animations, and other providers.
 */
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES), // Sets up the application's routes.
    provideAnimations(), // Enables Angular's animation capabilities.
    provideHttpClient(withInterceptorsFromDi()), // Configures HttpClient with dependency injection.
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Registers AuthInterceptor.
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Initializes Firebase app.
      provideAuth(() => getAuth()), // Provides Firebase authentication service.
      provideFirestore(() => getFirestore()), // Provides Firestore database service.
    ),
    { provide: HTTP_INTERCEPTORS, useClass: GlobalErrorInterceptor, multi: true }, // Registers GlobalErrorInterceptor.
    MessageService, // Provides PrimeNG's message service for notifications.
    DatePipe, // Provides Angular's DatePipe for date transformations.
  ]
})
  .catch(err => console.error(err));
