package com.studybuddy.studygroupservice.controllers;

import com.studybuddy.studygroupservice.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendNotification(@RequestParam String groupName) {
        try {
            // Call the service to send the email
            notificationService.sendEmail(groupName);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email sent successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the error and return an error response
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to send email: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}