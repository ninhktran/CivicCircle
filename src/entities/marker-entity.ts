/**
 * Interface representing a marker on a Google Map.
 * Contains the data needed to place and describe a marker on the map.
 */
export interface Marker {
    position: google.maps.LatLngLiteral; // The geographic coordinates where the marker is placed.
    title: string;                        // Title of the marker, typically used as a label.
    info: string;                         // Additional information about the marker, often used in info windows.
    id: number;                           // A unique identifier for the marker.
}
