package com.studybuddy.taskservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenRouterService {

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public OpenRouterService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getAIResponse(String userPrompt) {
        String url = "https://openrouter.ai/api/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        // Add required headers for OpenRouter
        headers.set("HTTP-Referer", "YOUR_SITE_URL"); // Replace with your actual URL
        headers.set("X-Title", "YOUR_APP_NAME"); // Replace with your app name

        Map<String, Object> request = new HashMap<>();
        request.put("model", "mistralai/mistral-7b-instruct"); // You can change to mixtral, gemma, etc.

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", userPrompt));
        request.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if (response.getBody() == null || !response.getBody().containsKey("choices")) {
            throw new RuntimeException("Invalid response from OpenRouter API");
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("No choices in response from OpenRouter API");
        }

        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        if (message == null || !message.containsKey("content")) {
            throw new RuntimeException("No message content in response from OpenRouter API");
        }

        return message.get("content").toString();
    }
}