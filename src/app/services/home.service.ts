import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthTestDto } from '../models/AuthTestDto';

/**
 * Service to handle HTTP requests related to the home component.
 * Provides methods to interact with the backend to retrieve data.
 */
@Injectable({ providedIn: 'root' })
export class HomeService {
  /**
   * Constructor for HomeService.
   * @param http HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetches data from the backend for the home component.
   * @returns An Observable of AuthTestDto containing the fetched data.
   */
  getAll(): Observable<AuthTestDto> {
    return this.http.get<AuthTestDto>(`${environment.apiUrl}/api/home/GetAll`);
  }
}
