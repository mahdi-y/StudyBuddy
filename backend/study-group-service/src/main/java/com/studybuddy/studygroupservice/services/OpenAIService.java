package com.studybuddy.studygroupservice.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studybuddy.studygroupservice.entities.Flashcard;
import com.studybuddy.studygroupservice.entities.StudyGroup;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OpenAIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.api.key}")
    private String apiKey;

    public List<Flashcard> generateFlashcards(String topic, StudyGroup group) {
        try {
            String prompt = String.format("""
                    You are a flashcard generator.
                    Based on the topic "%s", generate 5 flashcards.
                    Return only a JSON array, each object should contain "question" and "answer" fields.
                    Example:
                    [
                      {"question": "What is ...?", "answer": "..."},
                      {"question": "What is ...?", "answer": "..."}
                    ]
                    """, topic);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey); // ✅ OpenRouter style

            Map<String, Object> requestBody = Map.of(
                    "model", "mistralai/mistral-7b-instruct",
                    "temperature", 0.7,
                    "messages", List.of(Map.of(
                            "role", "user",
                            "content", prompt
                    ))
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://openrouter.ai/api/v1/chat/completions", // ✅ Use OpenRouter endpoint
                    request,
                    Map.class
            );

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                System.err.println("OpenRouter API Error: Empty response or non-OK status");
                return List.of();
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices == null || choices.isEmpty()) {
                System.err.println("OpenRouter API Error: No choices in response");
                return List.of();
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            if (message == null || message.get("content") == null) {
                System.err.println("OpenRouter API Error: No message content in response");
                return List.of();
            }

            String content = (String) message.get("content");

            List<Map<String, String>> parsedList = objectMapper.readValue(content, new TypeReference<>() {});

            return parsedList.stream()
                    .map(card -> new Flashcard(
                            null,
                            card.get("question"),
                            card.get("answer"),
                            group,
                            new Timestamp(System.currentTimeMillis())
                    ))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            System.err.println("OpenRouter Flashcard Generation Failed:");
            e.printStackTrace();
            return List.of();
        }
    }
}
