import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskBackofficeComponent } from './task-backoffice.component';

describe('TaskBackofficeComponent', () => {
  let component: TaskBackofficeComponent;
  let fixture: ComponentFixture<TaskBackofficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskBackofficeComponent]
    });
    fixture = TestBed.createComponent(TaskBackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
