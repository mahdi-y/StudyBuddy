package com.studybuddy.studygroupservice.controllers;

import com.studybuddy.studygroupservice.entities.Flashcard;
import com.studybuddy.studygroupservice.services.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin("*")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @PostMapping("/generate/{groupId}")
    public ResponseEntity<List<Flashcard>> generate(@PathVariable Long groupId) {
        List<Flashcard> flashcards = flashcardService.generateFlashcards(groupId);
        return ResponseEntity.ok(flashcards);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Flashcard>> getByGroup(@PathVariable Long groupId) {
        List<Flashcard> flashcards = flashcardService.getByGroup(groupId);
        return ResponseEntity.ok(flashcards);
    }
}
