package com.studybuddy.userservice.controller;

import com.studybuddy.userservice.dto.ResetPasswordRequest;
import com.studybuddy.userservice.dto.User;
import com.studybuddy.userservice.repo.LoginRepository;
import com.studybuddy.userservice.service.TwilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@CrossOrigin(origins = "http://192.168.1.56:30080")
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private LoginRepository userRepository;

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/request-reset")
    public ResponseEntity<String> requestReset(@RequestBody String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6-digit reset code
        String resetCode = String.format("%06d", new Random().nextInt(999999));
        long expiryTime = System.currentTimeMillis() + 15 * 60 * 1000; // 15 minutes expiry

        user.setResetCode(resetCode);
        user.setResetCodeExpiry(expiryTime);
        userRepository.save(user);

        // Send SMS
        String message = "Your password reset code is: " + resetCode;
        twilioService.sendSMS(user.getMobileNo(), message);

        return ResponseEntity.ok("Reset code sent to your phone.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetCode() == null || !user.getResetCode().equals(request.getResetCode())) {
            return ResponseEntity.badRequest().body("Invalid reset code.");
        }

        if (System.currentTimeMillis() > user.getResetCodeExpiry()) {
            return ResponseEntity.badRequest().body("Reset code expired.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully.");
    }
}


