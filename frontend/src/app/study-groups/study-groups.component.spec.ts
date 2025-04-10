import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupsComponent } from './study-groups.component';

describe('StudyGroupsComponent', () => {
  let component: StudyGroupsComponent;
  let fixture: ComponentFixture<StudyGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyGroupsComponent]
    });
    fixture = TestBed.createComponent(StudyGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
