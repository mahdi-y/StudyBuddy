import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdminComponent } from './update-admin.component';

describe('UpdateAdminComponent', () => {
  let component: UpdateAdminComponent;
  let fixture: ComponentFixture<UpdateAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAdminComponent]
    });
    fixture = TestBed.createComponent(UpdateAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
