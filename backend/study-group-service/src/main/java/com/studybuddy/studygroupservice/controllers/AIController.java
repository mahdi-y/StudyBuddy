package com.studybuddy.studygroupservice.controllers;

import com.studybuddy.studygroupservice.services.OpenAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/openai")
public class AIController {

    private final OpenAIService openAIService;

    public AIController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @GetMapping("/group-description")
    public ResponseEntity<String> generateDescription(@RequestParam String groupName) {
        String description = openAIService.generateGroupDescription(groupName);
        return ResponseEntity.ok(description);
    }
}
