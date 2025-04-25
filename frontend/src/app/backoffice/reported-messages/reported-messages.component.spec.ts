import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedMessagesComponent } from './reported-messages.component';

describe('ReportedMessagesComponent', () => {
  let component: ReportedMessagesComponent;
  let fixture: ComponentFixture<ReportedMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportedMessagesComponent]
    });
    fixture = TestBed.createComponent(ReportedMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
