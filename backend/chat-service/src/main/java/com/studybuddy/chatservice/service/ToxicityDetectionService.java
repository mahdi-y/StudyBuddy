package com.studybuddy.chatservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
public class ToxicityDetectionService {

    @Value("${neutrino.user-id}")
    private String userId;

    @Value("${neutrino.api-key}")
    private String apiKey;

    private static final String API_URL = "https://neutrinoapi.net/bad-word-filter";

    public boolean isWordToxic(String word) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = String.format("user-id=%s&api-key=%s&content=%s&censor-character=*", userId, apiKey, word);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Boolean isBad = (Boolean) response.getBody().get("is-bad");
                return Boolean.TRUE.equals(isBad);
            }
        } catch (Exception e) {
            System.err.println("Neutrino API error: " + e.getMessage());
        }

        return false;
    }
}
