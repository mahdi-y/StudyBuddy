package com.studybuddy.chatservice.service;

import com.studybuddy.chatservice.dto.MessageReportRequest;
import com.studybuddy.chatservice.model.Message;
import com.studybuddy.chatservice.model.MessageReport;
import com.studybuddy.chatservice.repository.MessageRepository;
import com.studybuddy.chatservice.repository.MessageReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MessageReportService {

    private final MessageReportRepository reportRepository;
    private final MessageRepository messageRepository;

    public MessageReportService(MessageReportRepository reportRepository, MessageRepository messageRepository) {
        this.reportRepository = reportRepository;
        this.messageRepository = messageRepository;
    }

    public MessageReport reportMessage(MessageReportRequest request) {
        Message message = messageRepository.findById(request.getMessageId())
                .orElseThrow(() -> new RuntimeException("Message not found"));

        MessageReport report = MessageReport.builder()
                .message(message)
                .reporterId(request.getReporterId())
                .reason(request.getReason())
                .timestamp(LocalDateTime.now())
                .build();

        return reportRepository.save(report);
    }

    public Iterable<MessageReport> getAllReports() {
        return reportRepository.findAll();
    }

    public void dismissReport(Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new RuntimeException("Report not found with ID: " + reportId);
        }
        reportRepository.deleteById(reportId);
    }

}