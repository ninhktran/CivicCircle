import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

/**
 * Component for displaying and interacting with a Google Map.
 * Allows users to view a map and interact with it by moving the map center or displaying coordinates.
 */
@Component({
  standalone: true,
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css'],
  imports: [GoogleMapsModule]
})
export class GoogleMapsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Initialization logic can go here
  }

  // Property to store the display information (like coordinates)
  display: any;

  // Initial center position for the map
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };

  // Default zoom level
  zoom = 4;

  /**
   * Updates the center of the map to the position where the user clicks.
   * @param event The map mouse event containing the new position.
   */
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center = event.latLng.toJSON();
    }
  }

  /**
   * Updates the display property with the coordinates where the user clicks.
   * @param event The map mouse event containing the coordinates.
   */
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.display = event.latLng.toJSON();
    }
  }
}
