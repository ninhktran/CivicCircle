/**
 * Environment settings for the development build of the application.
 * Includes configuration parameters used throughout the app.
 */
export const environment = {
  production: false,    // Flag indicating the app is running in development mode.
  apiUrl: 'https://localhost:4200', // Base URL for the application's backend API in development.

  // Firebase configuration parameters for the application.
  firebaseConfig: {
    apiKey: "AIzaSyCTX2mqiWZKsJLVXYlST8KQcE2WBl2GxPM",
    authDomain: "civic-circle-ee679.firebaseapp.com",
    projectId: "civic-circle-ee679",
    storageBucket: "civic-circle-ee679.appspot.com",
    messagingSenderId: "210525871048",
    appId: "1:210525871048:web:fa886ae8b7e2454184fefd",
    measurementId: "G-Z6PTBDBDTG"
  }
};
