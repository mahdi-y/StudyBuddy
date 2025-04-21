package com.studybuddy.studygroupservice.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JavaMailSender javaMailSender;

    @Value("${email.to}")
    private String toEmail;

    public NotificationService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(String groupName) {
        try {
            // Create the email message
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail); // Recipient email
            message.setSubject("Study Group Invitation");

            // Customize the "From" field
            String senderName = "StudyBuddy Support"; // Custom sender name
            String senderEmail = "laouiniamen1211@gmail.com"; // SMTP sender email
            message.setFrom(senderName + " <" + senderEmail + ">"); // Format: "Name <email>"

            // Set the email body
            message.setText("You have been invited to join the study group: " + groupName + ".");

            // Send the email
            javaMailSender.send(message);
            System.out.println("Email sent successfully to: " + toEmail);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}