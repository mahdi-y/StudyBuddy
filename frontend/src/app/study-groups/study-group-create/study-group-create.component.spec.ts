import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupCreateComponent } from './study-group-create.component';

describe('StudyGroupCreateComponent', () => {
  let component: StudyGroupCreateComponent;
  let fixture: ComponentFixture<StudyGroupCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyGroupCreateComponent]
    });
    fixture = TestBed.createComponent(StudyGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
