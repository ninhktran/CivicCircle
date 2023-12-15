import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AutLandingComponent } from '../aut-landing/aut-landing.component';
import { AddNewEventModalComponent } from '../add-new-event-modal/add-new-event-modal.component';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdvancedSearch, SearchService } from '../services/search.service';
import { FormsModule } from '@angular/forms';
import { EventType } from 'src/entities/event-entity';

/**
 * The main layout component that orchestrates various functionalities like
 * authentication, event creation, and advanced search within the application.
 */
@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [
    RouterModule,
    ToolbarModule,
    ButtonModule,
    CommonModule,
    ToastModule,
    MatDialogModule,
    NgbModule,
    FormsModule
  ],
})
export class LayoutComponent {
  dialogRef: any;
  isLoggedIn$ = this.authService.isLoggedIn$;
  nextDaysValue!: number;
  withinMilesValue!: number;
  eventTypeValue!: string;
  verifiedPoster: boolean = false;
  eventTypes: EventType[] = Object.values(EventType);

  @ViewChild('advancedSearchDropdown') advancedSearchDropdown!: NgbDropdown;

  /**
   * Constructor for the LayoutComponent.
   * @param authService Service for handling authentication.
   * @param dialog Service to manage Angular Material dialogs.
   * @param searchService Service for handling search functionality.
   */
  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private searchService: SearchService
  ) { }

  /**
   * Submits the advanced search criteria to the search service.
   */
  submitAdvancedSearch(): void {
    const advancedSearchData: AdvancedSearch = {
      days: this.nextDaysValue,
      miles: this.withinMilesValue,
      eventType: this.eventTypeValue,
      verifiedPoster: this.verifiedPoster
    };
    this.searchService.changeAdvancedSearch(advancedSearchData);
    if (this.advancedSearchDropdown) {
      this.advancedSearchDropdown.close();
    }
  }

  /**
   * Updates the search string for the application search feature.
   * @param searchValue The value inputted by the user for searching.
   */
  onSearchChange(searchValue: string): void {
    this.searchService.changeSearchString(searchValue);
  }

  /**
   * Logs out the current user from the application.
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Deletes the current user's account.
   */
  deleteAccount(): void {
    this.authService.deleteAccount();
  }

  /**
   * Retrieves the email address of the currently logged-in user.
   * @returns The email of the current user.
   */
  getEmail(): string {
    return this.authService.currentUser?.email!;
  }

  /**
   * Opens a dialog for user login.
   */
  openLoginDialog(): void {
    this.dialogRef = this.dialog.open(AutLandingComponent);
  }

  /**
   * Opens a dialog for adding a new event.
   */
  openAddNewEventDialog(): void {
    this.dialogRef = this.dialog.open(AddNewEventModalComponent, {
      width: '50%'
    });
  }

  /**
   * Handles changes to the 'verified poster' option in the advanced search.
   * @param event The event triggered by the change in the input field.
   */
  onVerifiedPosterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.verifiedPoster = input.checked;
  }
}
