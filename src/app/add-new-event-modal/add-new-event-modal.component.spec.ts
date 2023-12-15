import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEventModalComponent } from './add-new-event-modal.component';

describe('AddNewEventModalComponent', () => {
  let component: AddNewEventModalComponent;
  let fixture: ComponentFixture<AddNewEventModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddNewEventModalComponent]
    });
    fixture = TestBed.createComponent(AddNewEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
