package com.studybuddy.studygroupservice.services;

import com.studybuddy.studygroupservice.entities.Flashcard;
import com.studybuddy.studygroupservice.entities.StudyGroup;
import com.studybuddy.studygroupservice.repositories.FlashcardRepository;
import com.studybuddy.studygroupservice.repositories.StudyGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private StudyGroupRepository studyGroupRepository;

    @Autowired
    private OpenAIService openAIService;

    public List<Flashcard> generateFlashcards(Long groupId) {
        StudyGroup group = studyGroupRepository.findById(groupId).orElseThrow(() -> new IllegalArgumentException("Study Group not found"));
        List<Flashcard> flashcards = openAIService.generateFlashcards(group.getName(), group);
        return flashcardRepository.saveAll(flashcards);
    }

    public List<Flashcard> getByGroup(Long groupId) {
        return flashcardRepository.findByGroupId(groupId);
    }
}
