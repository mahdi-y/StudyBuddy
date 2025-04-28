import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupsBackComponent } from './study-groups-back.component';

describe('StudyGroupsComponent', () => {
  let component: StudyGroupsBackComponent;
  let fixture: ComponentFixture<StudyGroupsBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyGroupsBackComponent]
    });
    fixture = TestBed.createComponent(StudyGroupsBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
