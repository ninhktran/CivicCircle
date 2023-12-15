import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to interact with the Google Geocoding API.
 * Provides a method to geocode addresses into geographic coordinates.
 */
@Injectable({
    providedIn: 'root'
})
export class GeocodingService {
    constructor(private http: HttpClient) { }

    /**
     * Sends a request to the Google Geocoding API to convert a given address into geographic coordinates.
     * @param address The address to be geocoded.
     * @param apiKey The API key for accessing the Google Geocoding API.
     * @returns An Observable containing the geocoding response from the API.
     */
    geocodeAddress(address: string, apiKey: string): Observable<any> {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        return this.http.get(url);
    }
}
