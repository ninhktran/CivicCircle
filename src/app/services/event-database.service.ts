import { Injectable } from "@angular/core";
import { Firestore, collection, collectionData, doc, addDoc, deleteDoc, Timestamp, updateDoc } from "@angular/fire/firestore";

/**
 * Service to interact with the Firestore database for event-related operations.
 * Provides methods to get, add, delete, and update event data.
 */
@Injectable({
    providedIn: 'root'
})
export class EventDatabaseService {
    constructor(private fs: Firestore) { }

    /**
     * Retrieves all events from the Firestore database.
     * @returns An observable containing an array of event data, each with an added 'id' field.
     */
    getEvents() {
        let eventsCollection = collection(this.fs, 'events');
        return collectionData(eventsCollection, { idField: 'id' });
    }

    /**
     * Adds a new event to the Firestore database.
     * @param name Name of the event.
     * @param eventType Type of the event.
     * @param description Description of the event.
     * @param date Date and time of the event, as a Firestore Timestamp.
     * @param location Location of the event.
     * @param poster Email of the user who is posting the event.
     * @returns A promise resolved with the ID of the newly created document.
     */
    addNewEvent(name: string, eventType: string, description: string, date: Timestamp, location: string, poster: string) {
        let data = { Description: description, EventType: eventType, Name: name, Date: date, Location: location, poster: poster };
        let eventsCollection = collection(this.fs, 'events');

        return addDoc(eventsCollection, data);
    }

    /**
     * Deletes an event from the Firestore database.
     * @param id The ID of the event to delete.
     * @returns A promise resolved once the event is deleted.
     */
    deleteEvent(id: string) {
        let docRef = doc(this.fs, 'events/' + id);
        return deleteDoc(docRef);
    }

    /**
     * Updates an existing event in the Firestore database.
     * @param id The ID of the event to update.
     * @param updatedData An object containing the updated data for the event.
     * @returns A promise resolved once the event is updated.
     */
    updateEvent(id: string, updatedData: any) {
        let docRef = doc(this.fs, 'events/' + id);
        return updateDoc(docRef, updatedData);
    }
}
