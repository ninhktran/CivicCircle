import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Interface representing the structure of an advanced search query.
 */
export interface AdvancedSearch {
  days: number;
  miles: number;
  eventType: string;
  verifiedPoster: boolean;
}

/**
 * Service to manage and update search criteria for the application.
 * Manages both basic search strings and advanced search parameters.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchStringSource = new BehaviorSubject<string>('');
  currentSearchString = this.searchStringSource.asObservable();

  private advancedSearchSource = new BehaviorSubject<AdvancedSearch | null>(null);
  currentAdvancedSearch = this.advancedSearchSource.asObservable();

  /**
   * Updates the current basic search string.
   * @param search The new search string.
   */
  changeSearchString(search: string) {
    this.searchStringSource.next(search);
  }

  /**
   * Updates the current advanced search parameters.
   * @param search The new set of advanced search parameters.
   */
  changeAdvancedSearch(search: AdvancedSearch) {
    this.advancedSearchSource.next(search);
  }
}
