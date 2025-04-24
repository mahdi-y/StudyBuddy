import { Component, OnInit, Input } from '@angular/core';
import { FlashcardService } from '../../services/flashcard.service';
import { Flashcard } from '../../models/flashcard.model';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})
export class FlashcardComponent implements OnInit {
  @Input() groupId!: number; // Accept groupId as input from parent component
  flashcards: Flashcard[] = [];
  loading = false;

  constructor(private flashcardService: FlashcardService) {}

  ngOnInit(): void {
    if (this.groupId) {
      this.loadFlashcards();
    }
  }

  loadFlashcards(): void {
    this.loading = true;
    this.flashcardService.getByGroup(this.groupId).subscribe({
      next: data => {
        this.flashcards = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading flashcards:', err);
        this.loading = false;
      }
    });
  }

  generateFlashcards(): void {
    if (!this.groupId) {
      console.error('No group selected. Cannot generate flashcards.');
      return;
    }

    this.loading = true;
    this.flashcardService.generate(this.groupId).subscribe({
      next: data => {
        this.flashcards = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error generating flashcards:', err);
        this.loading = false;
      }
    });
  }
}
