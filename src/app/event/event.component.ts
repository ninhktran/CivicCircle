import { Component } from '@angular/core';
import { EventDatabaseService } from '../services/event-database.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../entities/event-entity';
import { Marker } from '../../entities/marker-entity';
import { AuthService } from '../services/auth.service';
import { Subscription, first } from 'rxjs';
import { UserDatabaseService } from '../services/user-database.service';
import { ProfileUser } from '../models/UserProfile';
import { ActivatedRoute } from '@angular/router';
import { AdvancedSearch, SearchService } from '../services/search.service';
import { GoogleMapsComponent } from '../google-maps/google-maps.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { GeocodingService } from '../services/geocoding.services';
import { markers } from '../../data/markers-data';

/**
 * EventComponent for handling event-related operations.
 * This component allows users to view, manage, and interact with events.
 */
@Component({
  standalone: true,
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  imports: [CommonModule, NgbModule, GoogleMapsComponent, GoogleMapsModule, FormsModule]
})
export class EventComponent {
  /**
   * Constructor initializes essential services.
   * @param eventdb Service for handling event-related database operations.
   * @param datePipe Service for formatting dates.
   * @param authService Service for handling user authentication.
   * @param userdb Service for managing user profile data.
   * @param route Service for accessing route parameters.
   * @param searchService Service for managing search functionalities.
   * @param geocodingService Service for converting addresses to geographic coordinates.
   */
  constructor(
    private eventdb: EventDatabaseService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private userdb: UserDatabaseService,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private geocodingService: GeocodingService
  ) {
    // Subscribe to simple string search
    this.searchService.currentSearchString.subscribe(searchString => {
      this.searchTerm = searchString;
      this.refreshEventsList();
    });

    // Subscribe to advanced search
    this.searchService.currentAdvancedSearch.subscribe(advancedSearch => {
      this.handleAdvancedSearch(advancedSearch);
    });
  }

  currentUser!: ProfileUser | null;
  private currentUserSubscription: Subscription = new Subscription();
  events: any = [];
  showOnlyInterested: boolean = false;
  searchTerm: string = '';
  display: any;
  center: google.maps.LatLngLiteral = { lat: 44.9740, lng: -93.2277 };
  zoom = 10;

  editingEventId: string | null = null;
  editedEvent: any = {};
  private apiKey = 'AIzaSyDE49YiztX_zvzW52FhVyaLAzSlDyh_lO';


  markers: Marker[] = markers;

  ngOnInit(): void {
    this.currentUserSubscription = this.userdb.currentUserProfile$.subscribe(
      currentUser => {
        this.currentUser = currentUser;
        this.refreshEventsList();
      }
    );

    this.route.url.subscribe(url => {
      this.showOnlyInterested = url[0]?.path === 'interested';
      this.refreshEventsList();
    });
  }

  /**
   * Refreshes the list of events based on various criteria like search terms or user interest.
   */
  refreshEventsList() {
    this.eventdb.getEvents().subscribe((data: any[]) => {
      let events = data.map((event: any) => {
        // Load the visibility state from local storage
        const isVisibleString = localStorage.getItem(`event-visibility-${event.id}`);
        const isVisible = isVisibleString ? JSON.parse(isVisibleString) : false;

        // if (event.Location) {
        //   this.convertAddressToCoordinates(event.Location, event.Name);
        // }

        return {
          ...event,
          isVisible: isVisible,
          Date: this.formatEventDate(event.Date)
        };
      });

      // Sort events by date, earliest first
      events.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

      if (this.showOnlyInterested && this.currentUser) {
        const interestedEvents = this.currentUser.interestedEvents;
        if (interestedEvents) {
          events = events.filter(event => interestedEvents.includes(event.id));
        }
      }

      // Filter events based on the search term
      if (this.searchTerm) {
        events = events.filter(event => event.Name && event.Name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      }

      this.events = events;
    });
  }

  /**
   * Deletes an event from the database.
   * @param id The ID of the event to delete.
   */
  deleteEvent(id: string) {
    this.eventdb.deleteEvent(id).then(() => {
      this.refreshEventsList();
    });
  }

  /**
   * Toggles the visibility of an event.
   * @param id The ID of the event to toggle.
   */
  toggleEventVisibility(id: string) {
    let event = this.events.find((e: Event) => e.id === id);
    if (event) {
      event.isVisible = !event.isVisible;

      // Save the visibility state to local storage
      localStorage.setItem(`event-visibility-${id}`, JSON.stringify(event.isVisible));
    }
  }

  /**
   * Starts the process of editing an event.
   * @param event The event data to edit.
   */
  startEditing(event: any) {
    this.editingEventId = event.id;
    // Initialize editedEvent with a copy of the event to be edited
    this.editedEvent = {
      ...event,
      Date: event.Date ? new Date(event.Date).toISOString().slice(0, 16) : null
    };
  }

  /**
   * Submits the edited event data.
   */
  submitEditedEvent() {
    if (!this.editingEventId) return;

    // Convert edited date and time to Firebase Timestamp format

    let jsDate = new Date(this.editedEvent.Date);
    let seconds = Math.floor(jsDate.getTime() / 1000);
    let nanoseconds = (jsDate.getTime() % 1000) * 10 ^ 6;
    let firebaseDate = new Timestamp(seconds, nanoseconds);

    // Update the event with the new date and time
    this.editedEvent.Date = firebaseDate;

    this.eventdb.updateEvent(this.editingEventId, this.editedEvent)
      .then(() => {
        this.editingEventId = null;
        this.editedEvent = {};
        this.refreshEventsList();
        // Handle successful update
      })
      .catch(error => {
        // Handle error
      });
  }

  /**
   * Cancels the editing process.
   */
  cancelEdit() {
    this.editingEventId = null;
    this.editedEvent = {};
  }

  /**
   * Formats the date of an event.
   * @param date The date to format.
   * @returns The formatted date string.
   */
  formatEventDate(date: any): string | null {
    if (!date || date === 'Invalid Date' || isNaN(new Date(date.seconds * 1000).getTime())) {
      return null;
    }
    return this.datePipe.transform(new Date(date.seconds * 1000), 'medium') || null;
  }

  /**
   * Shows detailed information about an event.
   * @param id The ID of the event to show.
   */
  showEvent(id: string) {
    let event = this.events.find((e: Event) => e.id === id);
    if (event) {
      event.isVisible = false;

      // Save the visibility state to local storage
      localStorage.setItem(`event-visibility-${id}`, JSON.stringify(event.isVisible));
    }
  }

  /**
   * Reports an event.
   * @param id The ID of the event to report.
   */
  reportEvent(id: string) {
    console.log(id);
  }

  /**
   * Checks if an event is marked as 'interested' by the current user.
   * @param eventId The ID of the event to check.
   * @returns Boolean indicating if the event is in the interested list.
   */
  isEventInterested(eventId: string): boolean {
    let isInterested = false;
    if (this.currentUser?.interestedEvents) {
      isInterested = this.currentUser.interestedEvents.includes(eventId);
    }
    return isInterested;
  }

  /**
   * Adds an event to the interested list of the current user.
   * @param eventId The ID of the event to add.
   */
  addToInterestedList(eventId: string) {
    console.log("hit");
    this.userdb.currentUserProfile$.pipe(first()).subscribe(user => {
      if (user) {
        // Check if interestedEvents is defined, if not, initialize it as an empty array
        if (!user.interestedEvents) {
          user.interestedEvents = [];
        }

        // Add the event id to the user's interestedEvents list
        user.interestedEvents.push(eventId);

        // Update the user in the database
        this.userdb.updateUser(user).subscribe(() => {
          console.log('Updated user');
        }, error => {
          console.error('Error updating user: ', error);
        });
      }
    });
  }

  /**
   * Removes an event from the interested list of the current user.
   * @param eventId The ID of the event to remove.
   */
  removeFromInterestedList(eventId: string) {
    this.userdb.currentUserProfile$.pipe(first()).subscribe(user => {
      if (user?.interestedEvents) {
        // Remove the event id from the user's interestedEvents list
        const index = user.interestedEvents.indexOf(eventId);
        if (index > -1) {
          user.interestedEvents.splice(index, 1);
        }

        // Update the user in the database
        this.userdb.updateUser(user).subscribe(() => {
          console.log('Updated user');
        }, error => {
          console.error('Error updating user: ', error);
        });
      }
    });
  }

  /**
   * Handles advanced search functionality.
   * @param advancedSearch The criteria for advanced search.
   */
  handleAdvancedSearch(advancedSearch: AdvancedSearch | null) {
    if (!advancedSearch) return;

    this.events = this.events.filter((event: any) => {
      let isMatch = true;

      // Filter by EventType
      if (advancedSearch.eventType !== undefined && advancedSearch.eventType !== '') {
        isMatch = isMatch && event.EventType === advancedSearch.eventType;
      }

      // Filter by Days
      if (advancedSearch.days !== undefined && advancedSearch.days !== null && event.Date) {
        // Current date
        let currentDate = new Date();
        // Get the epoch time in milliseconds and convert to days
        let currentDateDays = Math.floor(currentDate.getTime() / (24 * 60 * 60 * 1000));
        // Get the future date in days
        let futureDateDays = currentDateDays + Number(advancedSearch.days);


        const eventDate = new Date(event.Date);
        let eventDateDays = Math.floor(eventDate.getTime() / (24 * 60 * 60 * 1000));
        isMatch = isMatch && eventDateDays <= futureDateDays;
      }

      return isMatch;
    });
  }

  /**
  * Handles the movement of the map and updates the center position.
  * @param event The map movement event.
  */
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null)
      this.center = (event.latLng.toJSON());
  }

  /**
   * Updates display information based on map interactions.
   * @param event The map interaction event.
   */
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null)
      this.display = event.latLng.toJSON();
  }

  /**
   * Converts an address to coordinates and adds a marker on the map.
   * @param address The address to convert.
   * @param eventInfo Information about the associated event.
   */
  convertAddressToCoordinates(address: string, eventInfo: any) {
    this.geocodingService.geocodeAddress(address, this.apiKey).subscribe(response => {
      if (response.status === 'OK') {
        const location = response.results[0].geometry.location;
        this.addMarker(location.lat, location.lng, address, eventInfo);
      } else {
        console.error('Geocoding failed:', response.status);
      }
    });
  }

  /**
   * Adds a new marker to the map.
   * @param lat Latitude of the marker.
   * @param lng Longitude of the marker.
   * @param title Title of the marker.
   * @param eventInfo Additional information about the event.
   */
  addMarker(lat: number, lng: number, title: string, eventInfo: any) {
    const newMarker = {
      position: { lat, lng },
      title: title,
      info: `Event: ${eventInfo.Name}\nDescription: ${eventInfo.Description}`, // Customize as needed
      id: this.markers.length + 1
    };
    this.markers.push(newMarker);
  }



  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }
}
