import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupListComponent } from './study-group-list.component';

describe('StudyGroupListComponent', () => {
  let component: StudyGroupListComponent;
  let fixture: ComponentFixture<StudyGroupListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyGroupListComponent]
    });
    fixture = TestBed.createComponent(StudyGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
