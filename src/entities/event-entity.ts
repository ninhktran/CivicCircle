/**
 * Enumeration of different types of events.
 * Represents various categories of events that can be organized or attended.
 */
export enum EventType {
  LocalGovernmentMeeting = 'Local Government Meeting',
  EducationalWorkshop = 'Educational Workshop',
  CommunityForum = 'Community Forum',
  TownHallMeeting = 'Town Hall Meeting',
  VolunteerOpportunity = 'Volunteer Opportunity',
  DebateOrPoliticalForum = 'Debate or Political Forum',
  CulturalFestival = 'Cultural Festival',
  YouthCouncil = 'Youth Council',
  ProtestOrRally = 'Protest or Rally',
  PolicyWorkshop = 'Policy Workshop',
  NetworkingEvent = 'Networking Event',
  DocumentaryScreening = 'Documentary Screening'
}

/**
 * Interface representing the structure of an event.
 * Contains all relevant details for an event.
 */
export interface Event {
  id: string;           // Unique identifier for the event.
  name: string;         // Name of the event.
  eventType: EventType; // Type of the event, as defined in EventType enum.
  description: string;  // Description of the event.
  location: string;     // Location where the event is held.
  date: Date;           // Date and time of the event.
  poster: string;       // Email of the user who posted the event.
  isHidden: boolean;    // Flag to determine if the event is hidden or visible.
}
