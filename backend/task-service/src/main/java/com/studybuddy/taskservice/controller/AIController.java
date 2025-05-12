package com.studybuddy.taskservice.controller;

import com.studybuddy.taskservice.service.OpenRouterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private OpenRouterService openRouterService;

    @PostMapping("/generate")
    public ResponseEntity<String> generate(
            @RequestBody Map<String, String> request
    ) {
        String prompt = request.get("prompt");
        String context = request.get("context"); // Get page content from frontend

        // Combine context + prompt for the AI
        String fullPrompt = "Context:\n" + context + "\n\nQuestion: " + prompt;

        String aiResponse = openRouterService.getAIResponse(fullPrompt);
        return ResponseEntity.ok(aiResponse);
    }
}