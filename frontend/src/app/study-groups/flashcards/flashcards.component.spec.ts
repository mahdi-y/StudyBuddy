import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardComponent } from './flashcards.component';

describe('FlashcardsComponent', () => {
  let component: FlashcardComponent;
  let fixture: ComponentFixture<FlashcardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlashcardComponent]
    });
    fixture = TestBed.createComponent(FlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
