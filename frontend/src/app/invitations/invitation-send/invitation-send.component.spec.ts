import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationSendComponent } from './invitation-send.component';

describe('InvitationSendComponent', () => {
  let component: InvitationSendComponent;
  let fixture: ComponentFixture<InvitationSendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationSendComponent]
    });
    fixture = TestBed.createComponent(InvitationSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
