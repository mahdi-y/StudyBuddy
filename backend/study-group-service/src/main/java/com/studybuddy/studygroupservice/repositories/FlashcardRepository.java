package com.studybuddy.studygroupservice.repositories;

import com.studybuddy.studygroupservice.entities.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {

    // Method to find flashcards by groupId
    List<Flashcard> findByGroupId(Long groupId);

    // New method to delete flashcards by groupId
    void deleteByGroupId(Long groupId);
}
