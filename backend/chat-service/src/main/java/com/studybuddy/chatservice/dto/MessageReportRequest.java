package com.studybuddy.chatservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageReportRequest {
    private Long messageId;
    private int reporterId; // Reporter's ID
    private String reason;
}