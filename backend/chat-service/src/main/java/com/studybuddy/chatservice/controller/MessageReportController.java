package com.studybuddy.chatservice.controller;

import com.studybuddy.chatservice.dto.MessageReportRequest;
import com.studybuddy.chatservice.model.MessageReport;
import com.studybuddy.chatservice.service.MessageReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class MessageReportController {

    private final MessageReportService reportService;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageReportController(MessageReportService reportService, SimpMessagingTemplate messagingTemplate) {
        this.reportService = reportService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping
    public ResponseEntity<MessageReport> reportMessage(@RequestBody MessageReportRequest request) {
        MessageReport report = reportService.reportMessage(request);
        return ResponseEntity.ok(report);
    }

    @MessageMapping("/reportMessage")
    public void handleReportMessage(MessageReportRequest request) {
        MessageReport report = reportService.reportMessage(request);

        messagingTemplate.convertAndSend("/topic/reports", report);
        System.out.println("Message reported: " + report.getMessage().getContent());
    }

    @GetMapping
    public List<MessageReport> getAllReports() {
        List<MessageReport> reports = (List<MessageReport>) reportService.getAllReports();
        System.out.println("Fetched reports: " + reports); // Log the response
        return reports;
    }

    @DeleteMapping("/dismiss/{reportId}")
    public ResponseEntity<Void> dismissReport(@PathVariable Long reportId) {
        reportService.dismissReport(reportId);
        return ResponseEntity.noContent().build();
    }

}