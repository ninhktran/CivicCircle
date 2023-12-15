import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutLandingComponent } from './aut-landing.component';

describe('AutLandingComponent', () => {
  let component: AutLandingComponent;
  let fixture: ComponentFixture<AutLandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutLandingComponent]
    });
    fixture = TestBed.createComponent(AutLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
