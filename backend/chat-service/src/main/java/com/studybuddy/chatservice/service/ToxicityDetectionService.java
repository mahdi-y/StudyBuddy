package com.studybuddy.chatservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class ToxicityDetectionService {

    @Value("${huggingface.api.token}")
    private String huggingFaceToken;

    private static final String API_URL = "https://api-inference.huggingface.co/models/unitary/toxic-bert";

    public double getToxicityScore(String message) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(huggingFaceToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Collections.singletonMap("inputs", message);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, List.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> result = (List<Map<String, Object>>) response.getBody().get(0);
                for (Map<String, Object> label : result) {
                    String labelName = (String) label.get("label");
                    double score = (Double) label.get("score");

                    if ("toxic".equalsIgnoreCase(labelName) && score >= 0.5) {
                        return score;
                    }
                }
            }
        } catch (Exception e) {
            // Log error and assume message is NOT toxic if API fails
            System.err.println("Toxicity API error: " + e.getMessage());
        }

        return 0.0; // No toxicity detected
    }
}

