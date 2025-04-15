import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupUpdateComponent } from './study-group-update.component';

describe('StudyGroupUpdateComponent', () => {
  let component: StudyGroupUpdateComponent;
  let fixture: ComponentFixture<StudyGroupUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyGroupUpdateComponent]
    });
    fixture = TestBed.createComponent(StudyGroupUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
