package com.studybuddy.studygroupservice.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JavaMailSender javaMailSender;

    public NotificationService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(String groupName, String recipientEmail) {
        try {
            // Create the email message
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipientEmail);
            message.setSubject("Study Group Invitation");

            // Customize the "From" field
            String senderName = "StudyBuddy Support"; // Custom sender name
            String senderEmail = "laouiniamen1211@gmail.com"; // SMTP sender email
            message.setFrom(senderName + " <" + senderEmail + ">"); // Format: "Name <email>"

            // Set the email body
            message.setText("You have been invited to join the study group: " + groupName + ".");

            // Send the email
            javaMailSender.send(message);
            System.out.println("Email sent successfully to: " +recipientEmail);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
    public void sendInvitationResponseNotification(String responseStatus, String groupName, String recipientEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipientEmail);
            message.setSubject("Invitation Response: " + responseStatus);

            // Format sender (optional)
            message.setFrom("StudyBuddy Support <laouiniamen1211@gmail.com>");

            if ("ACCEPTED".equalsIgnoreCase(responseStatus)) {
                message.setText("Good news! Your invitation to join the study group '" +
                        groupName + "' has been accepted.");
            } else if ("REJECTED".equalsIgnoreCase(responseStatus)) {
                message.setText("Unfortunately, your invitation to join the study group '" +
                        groupName + "' was declined.");
            }

            javaMailSender.send(message);
            System.out.println("Status notification email sent to: " + recipientEmail);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send status notification email: " + e.getMessage(), e);
        }
    }
}