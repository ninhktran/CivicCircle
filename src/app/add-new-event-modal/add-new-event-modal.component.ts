import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { EventDatabaseService } from '../services/event-database.service';
import { Timestamp } from 'firebase/firestore';
import { AuthService } from '../services/auth.service';
import { EventType } from 'src/entities/event-entity';

/**
 * Component for adding a new event.
 * This component uses a modal dialog to collect event details from the user.
 */
@Component({
  selector: 'add-new-event-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './add-new-event-modal.component.html',
  styleUrls: ['./add-new-event-modal.component.css'],
})
export class AddNewEventModalComponent {
  // Event details
  eventName!: string;
  description!: string;
  eventType!: EventType;
  dateTime!: Date;
  location!: string;

  // Array of possible event types
  eventTypes: EventType[] = Object.values(EventType);

  /**
   * Constructor for the AddNewEventModalComponent.
   * @param dialogRef Reference to the dialog opened as this modal.
   * @param eventdb Service for handling event-related database operations.
   * @param authService Service for authentication related functionality.
   */
  constructor(
    public dialogRef: MatDialogRef<AddNewEventModalComponent>,
    private eventdb: EventDatabaseService,
    private authService: AuthService
  ) { }

  /**
   * Submits the form for adding a new event.
   * Converts the dateTime to Firebase compatible Timestamp and calls the service to add the event.
   */
  submitAddNewEventForm() {
    // Convert dateTime string to Date object
    let jsDate = new Date(this.dateTime);
    // Convert Date to seconds and nanoseconds
    let seconds = Math.floor(jsDate.getTime() / 1000);
    let nanoseconds = (jsDate.getTime() % 1000) * 10 ^ 6;
    let firebaseDate = new Timestamp(seconds, nanoseconds);

    // Call service to add the new event
    this.eventdb.addNewEvent(
      this.eventName,
      this.eventType,
      this.description,
      firebaseDate,
      this.location,
      this.authService.currentUser?.email!
    );

    // Close the modal dialog
    this.dialogRef.close();
  }

  /**
   * Clears the form fields.
   * @param form The form to be cleared.
   */
  clearForm(form: NgForm) {
    form.resetForm();
  }
}
